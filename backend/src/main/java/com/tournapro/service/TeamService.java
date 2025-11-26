package com.tournapro.service;

import com.tournapro.dto.TeamRequest;
import com.tournapro.entity.Division;
import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import com.tournapro.repository.DivisionRepository;
import com.tournapro.repository.TeamRepository;
import com.tournapro.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final DivisionRepository divisionRepository;

    @Transactional
    public Team createTeam(Long tournamentId, TeamRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Team team = new Team();
        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setTournament(tournament);

        if (request.getDivisionId() != null) {
            Division division = divisionRepository.findById(request.getDivisionId())
                    .orElseThrow(() -> new RuntimeException("Division not found"));
            team.setDivision(division);
        }

        return teamRepository.save(team);
    }

    public List<Team> getTeamsByTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return teamRepository.findByTournament(tournament);
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Transactional
    public Team updateTeam(Long id, TeamRequest request) {
        Team team = getTeamById(id);
        
        team.setName(request.getName());
        team.setDescription(request.getDescription());

        if (request.getDivisionId() != null) {
            Division division = divisionRepository.findById(request.getDivisionId())
                    .orElseThrow(() -> new RuntimeException("Division not found"));
            team.setDivision(division);
        }

        return teamRepository.save(team);
    }

    @Transactional
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
