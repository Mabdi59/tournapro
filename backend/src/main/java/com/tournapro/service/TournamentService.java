package com.tournapro.service;

import com.tournapro.dto.CreateTournamentRequest;
import com.tournapro.dto.TournamentResponse;
import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import com.tournapro.repository.TournamentRepository;
import com.tournapro.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public TournamentService(TournamentRepository tournamentRepository,
                             UserRepository userRepository) {
        this.tournamentRepository = tournamentRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // assuming username = email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
    }

    // CREATE
    @Transactional
    public TournamentResponse createTournament(CreateTournamentRequest request) {
        User owner = getCurrentUser();

        Tournament t = new Tournament();
        t.setOwner(owner);
        t.setTitle(request.getTitle().trim());
        t.setPrimaryVenue(request.getPrimaryVenue());
        t.setStartDate(request.getStartDate());

        Tournament saved = tournamentRepository.save(t);

        return toResponse(saved);
    }

    // LIST (for logged-in user)
    @Transactional(readOnly = true)
    public List<TournamentResponse> getMyTournaments() {
        User owner = getCurrentUser();
        return tournamentRepository.findByOwnerOrderByCreatedAtDesc(owner)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID (no owner check yet – you can restrict this if you want)
    @Transactional(readOnly = true)
    public TournamentResponse getTournament(Long id) {
        Tournament t = tournamentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + id));
        return toResponse(t);
    }

    // DELETE – only if it belongs to current user
    @Transactional
    public void deleteTournament(Long id) {
        User owner = getCurrentUser();

        Tournament t = tournamentRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() ->
                        new IllegalArgumentException("Tournament not found or not owned by current user: " + id)
                );

        tournamentRepository.delete(t);
    }

    // COPY – simple copy of basic info, still owned by current user
    // (Later you can extend this to copy teams, format, etc.)
    @Transactional
    public TournamentResponse copyTournament(Long id) {
        User owner = getCurrentUser();

        Tournament original = tournamentRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() ->
                        new IllegalArgumentException("Tournament not found or not owned by current user: " + id)
                );

        Tournament copy = new Tournament();
        copy.setOwner(owner);
        copy.setTitle(original.getTitle());           // you could add " (copy)" if you want
        copy.setPrimaryVenue(original.getPrimaryVenue());
        copy.setStartDate(original.getStartDate());

        Tournament savedCopy = tournamentRepository.save(copy);
        return toResponse(savedCopy);
    }

    private TournamentResponse toResponse(Tournament t) {
        return new TournamentResponse(
                t.getId(),
                t.getTitle(),
                t.getPrimaryVenue(),
                t.getStartDate(),
                t.getCreatedAt()
        );
    }
}
