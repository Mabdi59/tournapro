package com.tournapro.service;

import com.tournapro.dto.CreatePlayerRequest;
import com.tournapro.dto.PlayerResponse;
import com.tournapro.entity.Player;
import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import com.tournapro.repository.PlayerRepository;
import com.tournapro.repository.TeamRepository;
import com.tournapro.repository.TournamentRepository;
import com.tournapro.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public PlayerService(PlayerRepository playerRepository,
                         TeamRepository teamRepository,
                         TournamentRepository tournamentRepository,
                         UserRepository userRepository) {
        this.playerRepository = playerRepository;
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

    private Team getTeamIfOwned(Long tournamentId, Long teamId) {
        Tournament t = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));

        // ensure team belongs to tournament
        if (!team.getTournament().getId().equals(t.getId())) {
            throw new IllegalArgumentException("Team does not belong to tournament");
        }

        // ensure current user owns tournament
        User current = getCurrentUser();
        if (!t.getOwner().getId().equals(current.getId())) {
            throw new IllegalStateException("You do not own this tournament");
        }

        return team;
    }

    @Transactional
    public PlayerResponse createPlayer(Long tournamentId, Long teamId, CreatePlayerRequest req) {
        Team team = getTeamIfOwned(tournamentId, teamId);

        Player p = new Player();
        p.setTeam(team);
        p.setName(req.getName());
        p.setDob(req.getDob());
        p.setNumber(req.getNumber());

        Player saved = playerRepository.save(p);
        return toResponse(saved);
    }

    @Transactional
    public List<PlayerResponse> bulkCreate(Long tournamentId, Long teamId, List<CreatePlayerRequest> reqs) {
        Team team = getTeamIfOwned(tournamentId, teamId);

        List<Player> created = reqs.stream().map(r -> {
            Player p = new Player();
            p.setTeam(team);
            p.setName(r.getName());
            p.setDob(r.getDob());
            p.setNumber(r.getNumber());
            return p;
        }).collect(Collectors.toList());

        List<Player> saved = playerRepository.saveAll(created);
        return saved.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> listPlayers(Long tournamentId, Long teamId) {
        Team team = getTeamIfOwned(tournamentId, teamId);
        return playerRepository.findByTeamOrderByNameAsc(team)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // --- NEW: update and delete methods ---

    @Transactional
    public PlayerResponse updatePlayer(Long tournamentId, Long teamId, Long playerId, CreatePlayerRequest req) {
        Team team = getTeamIfOwned(tournamentId, teamId);

        Player existing = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + playerId));

        // ensure the player belongs to the team
        if (!existing.getTeam().getId().equals(team.getId())) {
            throw new IllegalArgumentException("Player does not belong to the specified team");
        }

        // apply updates
        existing.setName(req.getName());
        existing.setDob(req.getDob());
        existing.setNumber(req.getNumber());

        Player saved = playerRepository.save(existing);
        return toResponse(saved);
    }

    @Transactional
    public void deletePlayer(Long tournamentId, Long teamId, Long playerId) {
        Team team = getTeamIfOwned(tournamentId, teamId);

        Player existing = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + playerId));

        if (!existing.getTeam().getId().equals(team.getId())) {
            throw new IllegalArgumentException("Player does not belong to the specified team");
        }

        playerRepository.delete(existing);
    }

    private PlayerResponse toResponse(Player p) {
        return new PlayerResponse(
                p.getId(),
                p.getName(),
                p.getDob(),
                p.getNumber(),
                p.getCreatedAt()
        );
    }
}
