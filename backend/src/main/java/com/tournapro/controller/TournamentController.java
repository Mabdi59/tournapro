package com.tournapro.controller;

import com.tournapro.dto.CreateTournamentRequest;
import com.tournapro.dto.TournamentResponse;
import com.tournapro.service.TournamentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    // POST /api/tournaments  -> create and return the new tournament
    @PostMapping
    public ResponseEntity<TournamentResponse> createTournament(
            @Valid @RequestBody CreateTournamentRequest request
    ) {
        TournamentResponse response = tournamentService.createTournament(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/tournaments  -> list tournaments for current user
    @GetMapping
    public ResponseEntity<List<TournamentResponse>> getMyTournaments() {
        return ResponseEntity.ok(tournamentService.getMyTournaments());
    }

    // GET /api/tournaments/{id}  -> fetch by id
    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponse> getTournament(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournament(id));
    }

    // DELETE /api/tournaments/{id}  -> delete tournament (owned by current user)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/tournaments/{id}/copy  -> create a copy of this tournament
    @PostMapping("/{id}/copy")
    public ResponseEntity<TournamentResponse> copyTournament(@PathVariable Long id) {
        TournamentResponse response = tournamentService.copyTournament(id);
        return ResponseEntity.ok(response);
    }
}
