package com.tournapro.controller;

import com.tournapro.entity.Division;
import com.tournapro.entity.Match;
import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import com.tournapro.service.DivisionService;
import com.tournapro.service.MatchService;
import com.tournapro.service.TeamService;
import com.tournapro.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final TournamentService tournamentService;
    private final TeamService teamService;
    private final DivisionService divisionService;
    private final MatchService matchService;

    @GetMapping("/tournaments")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @GetMapping("/tournaments/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournamentById(id));
    }

    @GetMapping("/tournaments/{tournamentId}/teams")
    public ResponseEntity<List<Team>> getTeamsByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(teamService.getTeamsByTournament(tournamentId));
    }

    @GetMapping("/tournaments/{tournamentId}/divisions")
    public ResponseEntity<List<Division>> getDivisionsByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(divisionService.getDivisionsByTournament(tournamentId));
    }

    @GetMapping("/divisions/{divisionId}/matches")
    public ResponseEntity<List<Match>> getMatchesByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(matchService.getMatchesByDivision(divisionId));
    }
}
