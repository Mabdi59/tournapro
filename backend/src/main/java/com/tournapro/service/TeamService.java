package com.tournapro.service;

import com.tournapro.dto.CreateTeamRequest;
import com.tournapro.dto.TeamResponse;
import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import com.tournapro.repository.TeamRepository;
import com.tournapro.repository.TournamentRepository;
import com.tournapro.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository,
                       TournamentRepository tournamentRepository,
                       UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
    }

    private Tournament getOwnedTournament(Long tournamentId) {
        Tournament t = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

        User current = getCurrentUser();
        if (!t.getOwner().getId().equals(current.getId())) {
            throw new IllegalStateException("You do not own this tournament");
        }
        return t;
    }

    @Transactional
    public TeamResponse createTeam(Long tournamentId, CreateTeamRequest request) {
        Tournament tournament = getOwnedTournament(tournamentId);

        Team team = new Team();
        team.setTournament(tournament);
        team.setName(request.getName());
        team.setShortName(request.getShortName());
        team.setEmail(request.getEmail());
        team.setCountry(request.getCountry());
        team.setLogoUrl(request.getLogoUrl());
        team.setDressingRoom(request.getDressingRoom());

        // NEW: set present/paid if provided (default false)
        if (request.getPresent() != null) {
            team.setPresent(request.getPresent());
        }
        if (request.getPaid() != null) {
            team.setPaid(request.getPaid());
        }

        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    @Transactional
    public List<TeamResponse> bulkCreate(Long tournamentId, List<CreateTeamRequest> requests) {
        Tournament tournament = getOwnedTournament(tournamentId);

        List<Team> teams = requests.stream().map(r -> {
            Team t = new Team();
            t.setTournament(tournament);
            t.setName(r.getName());
            t.setShortName(r.getShortName());
            t.setEmail(r.getEmail());
            t.setCountry(r.getCountry());
            t.setLogoUrl(r.getLogoUrl());
            t.setDressingRoom(r.getDressingRoom());
            if (r.getPresent() != null) t.setPresent(r.getPresent());
            if (r.getPaid() != null) t.setPaid(r.getPaid());
            return t;
        }).collect(Collectors.toList());

        List<Team> saved = teamRepository.saveAll(teams);
        return saved.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getTeams(Long tournamentId) {
        Tournament tournament = getOwnedTournament(tournamentId);
        return teamRepository.findByTournamentOrderByNameAsc(tournament)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<TeamResponse> getTeamsPaged(Long tournamentId, int page, int size) {
        Tournament tournament = getOwnedTournament(tournamentId);
        List<TeamResponse> all = teamRepository.findByTournamentOrderByNameAsc(tournament)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        int from = Math.min(page * size, all.size());
        int to = Math.min(from + size, all.size());
        List<TeamResponse> sub = all.subList(from, to);
        return new PageImpl<>(sub, PageRequest.of(page, size), all.size());
    }

    @Transactional
    public TeamResponse updateTeam(Long tournamentId, Long teamId, CreateTeamRequest request) {
        Tournament tournament = getOwnedTournament(tournamentId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));

        // ensure team belongs to tournament
        if (!team.getTournament().getId().equals(tournament.getId())) {
            throw new IllegalStateException("Team does not belong to the tournament");
        }

        // Partial update: only overwrite fields that are non-null (and non-empty for name)
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            team.setName(request.getName().trim());
        }
        if (request.getShortName() != null) {
            team.setShortName(request.getShortName().trim());
        }
        if (request.getEmail() != null) {
            team.setEmail(request.getEmail().trim());
        }
        if (request.getCountry() != null) {
            team.setCountry(request.getCountry().trim());
        }
        if (request.getLogoUrl() != null) {
            team.setLogoUrl(request.getLogoUrl().trim());
        }
        if (request.getDressingRoom() != null) {
            team.setDressingRoom(request.getDressingRoom().trim());
        }

        // NEW: update present/paid if provided
        if (request.getPresent() != null) {
            team.setPresent(request.getPresent());
        }
        if (request.getPaid() != null) {
            team.setPaid(request.getPaid());
        }

        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    @Transactional
    public void deleteTeam(Long tournamentId, Long teamId) {
        Tournament tournament = getOwnedTournament(tournamentId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));

        if (!team.getTournament().getId().equals(tournament.getId())) {
            throw new IllegalStateException("Team does not belong to the tournament");
        }

        teamRepository.delete(team);
    }

    // NEW: upload logo and save as base64 data URL in logoUrl column
    @Transactional
    public TeamResponse uploadLogo(Long tournamentId, Long teamId, MultipartFile file) throws IOException {
        Tournament tournament = getOwnedTournament(tournamentId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));

        if (!team.getTournament().getId().equals(tournament.getId())) {
            throw new IllegalStateException("Team does not belong to the tournament");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Empty file upload");
        }

        String contentType = file.getContentType();
        byte[] bytes = file.getBytes();
        String base64 = Base64.getEncoder().encodeToString(bytes);
        String dataUrl = (contentType != null ? "data:" + contentType + ";base64," : "data:image/png;base64,") + base64;

        team.setLogoUrl(dataUrl);
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    private TeamResponse toResponse(Team t) {
        return new TeamResponse(
                t.getId(),
                t.getName(),
                t.getShortName(),
                t.getEmail(),
                t.getCountry(),
                t.getLogoUrl(),
                t.getDressingRoom(),
                t.getPresent(),
                t.getPaid(),
                t.getCreatedAt()
        );
    }
}
