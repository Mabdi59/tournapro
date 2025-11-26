package com.tournapro.service;

import com.tournapro.dto.DivisionRequest;
import com.tournapro.entity.Division;
import com.tournapro.entity.Tournament;
import com.tournapro.repository.DivisionRepository;
import com.tournapro.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DivisionService {

    private final DivisionRepository divisionRepository;
    private final TournamentRepository tournamentRepository;

    @Transactional
    public Division createDivision(Long tournamentId, DivisionRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Division division = new Division();
        division.setName(request.getName());
        division.setDescription(request.getDescription());
        division.setTournament(tournament);

        return divisionRepository.save(division);
    }

    public List<Division> getDivisionsByTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return divisionRepository.findByTournament(tournament);
    }

    public Division getDivisionById(Long id) {
        return divisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Division not found"));
    }

    @Transactional
    public Division updateDivision(Long id, DivisionRequest request) {
        Division division = getDivisionById(id);
        
        division.setName(request.getName());
        division.setDescription(request.getDescription());

        return divisionRepository.save(division);
    }

    @Transactional
    public void deleteDivision(Long id) {
        divisionRepository.deleteById(id);
    }
}
