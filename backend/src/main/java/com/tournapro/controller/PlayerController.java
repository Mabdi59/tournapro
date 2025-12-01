package com.tournapro.controller;

import com.tournapro.dto.PlayerRequest;
import com.tournapro.dto.PlayerResponse;
import com.tournapro.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Player Controller - REST API endpoints for player management
 * File: backend/src/main/java/com/tournapro/controller/PlayerController.java
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    /**
     * Get all players for a team
     * GET /api/teams/{teamId}/players
     */
    @GetMapping("/teams/{teamId}/players")
    public ResponseEntity<List<PlayerResponse>> getPlayersByTeam(@PathVariable Long teamId) {
        List<PlayerResponse> players = playerService.getPlayersByTeam(teamId);
        return ResponseEntity.ok(players);
    }

    /**
     * Get all players in a tournament
     * GET /api/tournaments/{tournamentId}/players
     */
    @GetMapping("/tournaments/{tournamentId}/players")
    public ResponseEntity<List<PlayerResponse>> getPlayersByTournament(@PathVariable Long tournamentId) {
        List<PlayerResponse> players = playerService.getPlayersByTournament(tournamentId);
        return ResponseEntity.ok(players);
    }

    /**
     * Get a single player by ID
     * GET /api/players/{id}
     */
    @GetMapping("/players/{id}")
    public ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id) {
        PlayerResponse player = playerService.getPlayerById(id);
        return ResponseEntity.ok(player);
    }

    /**
     * Create a new player
     * POST /api/teams/{teamId}/players
     * Requires ORGANIZER or ADMIN role
     */
    @PostMapping("/teams/{teamId}/players")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<PlayerResponse> createPlayer(
            @PathVariable Long teamId,
            @Valid @RequestBody PlayerRequest request) {

        // teamId from path is the source of truth; ignore request.teamId if present
        request.setTeamId(teamId);

        PlayerResponse player = playerService.createPlayer(teamId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(player);
    }

    /**
     * Update an existing player
     * PUT /api/players/{id}
     * Requires ORGANIZER or ADMIN role
     */
    @PutMapping("/players/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<PlayerResponse> updatePlayer(
            @PathVariable Long id,
            @Valid @RequestBody PlayerRequest request) {

        PlayerResponse player = playerService.updatePlayer(id, request);
        return ResponseEntity.ok(player);
    }

    /**
     * Delete a player
     * DELETE /api/players/{id}
     * Requires ORGANIZER or ADMIN role
     */
    @DeleteMapping("/players/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get top scorers in a tournament
     * GET /api/tournaments/{tournamentId}/top-scorers?limit=10
     */
    @GetMapping("/tournaments/{tournamentId}/top-scorers")
    public ResponseEntity<List<PlayerResponse>> getTopScorers(
            @PathVariable Long tournamentId,
            @RequestParam(defaultValue = "10") int limit) {

        List<PlayerResponse> topScorers = playerService.getTopScorers(tournamentId, limit);
        return ResponseEntity.ok(topScorers);
    }

    /**
     * Update player statistics
     * PATCH /api/players/{id}/stats
     * Requires REFEREE, ORGANIZER, or ADMIN role
     *
     * Example:
     *   PATCH /api/players/5/stats?goals=1&assists=0&yellowCards=1
     */
    @PatchMapping("/players/{id}/stats")
    @PreAuthorize("hasAnyRole('REFEREE', 'ORGANIZER', 'ADMIN')")
    public ResponseEntity<PlayerResponse> updatePlayerStats(
            @PathVariable Long id,
            @RequestParam(required = false) Integer goals,
            @RequestParam(required = false) Integer assists,
            @RequestParam(required = false) Integer yellowCards,
            @RequestParam(required = false) Integer redCards) {

        PlayerResponse player = playerService.updatePlayerStats(id, goals, assists, yellowCards, redCards);
        return ResponseEntity.ok(player);
    }
}
