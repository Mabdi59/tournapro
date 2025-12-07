package com.tournapro.service;

import com.tournapro.dto.CreateRefereeRequest;
import com.tournapro.dto.RefereeResponse;
import com.tournapro.entity.Referee;
import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import com.tournapro.repository.RefereeRepository;
import com.tournapro.repository.TournamentRepository;
import com.tournapro.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RefereeService {

    private final RefereeRepository refereeRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public RefereeService(RefereeRepository refereeRepository,
                          TournamentRepository tournamentRepository,
                          UserRepository userRepository) {
        this.refereeRepository = refereeRepository;
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
    public RefereeResponse createReferee(Long tournamentId, CreateRefereeRequest request) {
        Tournament tournament = getOwnedTournament(tournamentId);

        Referee r = new Referee();
        r.setTournament(tournament);
        r.setName(request.getName());
        r.setEmail(request.getEmail());
        r.setPhone(request.getPhone());
        r.setRole(request.getRole());

        Referee saved = refereeRepository.save(r);
        return toResponse(saved);
    }

    @Transactional
    public List<RefereeResponse> bulkCreate(Long tournamentId, List<CreateRefereeRequest> requests) {
        Tournament tournament = getOwnedTournament(tournamentId);

        List<Referee> refs = requests.stream().map(req -> {
            Referee r = new Referee();
            r.setTournament(tournament);
            r.setName(req.getName());
            r.setEmail(req.getEmail());
            r.setPhone(req.getPhone());
            r.setRole(req.getRole());
            return r;
        }).collect(Collectors.toList());

        List<Referee> saved = refereeRepository.saveAll(refs);
        return saved.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RefereeResponse> listReferees(Long tournamentId) {
        Tournament tournament = getOwnedTournament(tournamentId);
        return refereeRepository.findByTournamentOrderByNameAsc(tournament)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RefereeResponse updateReferee(Long tournamentId, Long refereeId, CreateRefereeRequest request) {
        Tournament tournament = getOwnedTournament(tournamentId);

        Referee r = refereeRepository.findById(refereeId)
                .orElseThrow(() -> new IllegalArgumentException("Referee not found: " + refereeId));

        if (!r.getTournament().getId().equals(tournament.getId())) {
            throw new IllegalStateException("Referee not part of this tournament");
        }

        r.setName(request.getName());
        r.setEmail(request.getEmail());
        r.setPhone(request.getPhone());
        r.setRole(request.getRole());

        Referee saved = refereeRepository.save(r);
        return toResponse(saved);
    }

    @Transactional
    public void deleteReferee(Long tournamentId, Long refereeId) {
        Tournament tournament = getOwnedTournament(tournamentId);

        Referee r = refereeRepository.findById(refereeId)
                .orElseThrow(() -> new IllegalArgumentException("Referee not found: " + refereeId));

        if (!r.getTournament().getId().equals(tournament.getId())) {
            throw new IllegalStateException("Referee not part of this tournament");
        }

        refereeRepository.delete(r);
    }

    private RefereeResponse toResponse(Referee r) {
        return new RefereeResponse(
                r.getId(),
                r.getName(),
                r.getEmail(),
                r.getPhone(),
                r.getRole(),
                r.getCreatedAt()
        );
    }
}

