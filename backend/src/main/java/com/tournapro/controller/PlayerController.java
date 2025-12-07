package com.tournapro.controller;

import com.tournapro.dto.CreatePlayerRequest;
import com.tournapro.dto.PlayerResponse;
import com.tournapro.service.PlayerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}/teams/{teamId}/players")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping
    public ResponseEntity<PlayerResponse> createPlayer(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId,
            @Valid @RequestBody CreatePlayerRequest request
    ) {
        return ResponseEntity.ok(playerService.createPlayer(tournamentId, teamId, request));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<PlayerResponse>> bulkCreate(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId,
            @Valid @RequestBody List<CreatePlayerRequest> requests
    ) {
        return ResponseEntity.ok(playerService.bulkCreate(tournamentId, teamId, requests));
    }

    @GetMapping
    public ResponseEntity<List<PlayerResponse>> listPlayers(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId
    ) {
        return ResponseEntity.ok(playerService.listPlayers(tournamentId, teamId));
    }

    // Update player (PUT or PATCH)
    @RequestMapping(value = "/{playerId}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<PlayerResponse> updatePlayer(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId,
            @PathVariable Long playerId,
            @Valid @RequestBody CreatePlayerRequest request
    ) {
        return ResponseEntity.ok(playerService.updatePlayer(tournamentId, teamId, playerId, request));
    }

    // Delete player
    @DeleteMapping("/{playerId}")
    public ResponseEntity<Void> deletePlayer(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId,
            @PathVariable Long playerId
    ) {
        playerService.deletePlayer(tournamentId, teamId, playerId);
        return ResponseEntity.noContent().build();
    }
}
