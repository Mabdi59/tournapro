package com.tournapro.service;

import com.tournapro.dto.AdministratorResponse;
import com.tournapro.dto.CreateAdministratorRequest;
import com.tournapro.entity.Administrator;
import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import com.tournapro.repository.AdministratorRepository;
import com.tournapro.repository.TournamentRepository;
import com.tournapro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministratorService {

    private final AdministratorRepository adminRepo;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public AdministratorService(AdministratorRepository adminRepo,
                                TournamentRepository tournamentRepository,
                                UserRepository userRepository) {
        this.adminRepo = adminRepo;
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
    public AdministratorResponse addAdministrator(Long tournamentId, CreateAdministratorRequest request) {
        Tournament t = getOwnedTournament(tournamentId);

        // ensure the email belongs to a registered TournaPro user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Only registered TournaPro users can be added as administrators"));

        // prevent duplicates
        if (adminRepo.findByTournamentAndEmailIgnoreCase(t, request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Administrator with that email already exists");
        }

        Administrator a = new Administrator();
        a.setTournament(t);
        a.setEmail(user.getEmail());
        a.setRights(request.getRights());

        Administrator saved = adminRepo.save(a);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AdministratorResponse> listAdministrators(Long tournamentId) {
        Tournament t = getOwnedTournament(tournamentId);
        return adminRepo.findByTournamentOrderByCreatedAtDesc(t)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeAdministrator(Long tournamentId, Long adminId) {
        Tournament t = getOwnedTournament(tournamentId);
        Administrator a = adminRepo.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Administrator not found: " + adminId));
        if (!a.getTournament().getId().equals(t.getId())) {
            throw new IllegalStateException("Administrator not part of this tournament");
        }
        adminRepo.delete(a);
    }

    private AdministratorResponse toResponse(Administrator a) {
        return new AdministratorResponse(
                a.getId(),
                a.getEmail(),
                a.getRights(),
                a.getCreatedAt()
        );
    }
}
