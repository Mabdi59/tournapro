package com.tournapro.controller;

import com.tournapro.dto.MatchResultRequest;
import com.tournapro.entity.Match;
import com.tournapro.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/divisions/{divisionId}/matches")
    public ResponseEntity<List<Match>> getMatchesByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(matchService.getMatchesByDivision(divisionId));
    }

    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PutMapping("/matches/{id}/result")
    @PreAuthorize("hasAnyRole('REFEREE', 'ORGANIZER', 'ADMIN')")
    public ResponseEntity<Match> updateMatchResult(
            @PathVariable Long id,
            @Valid @RequestBody MatchResultRequest request) {
        return ResponseEntity.ok(matchService.updateMatchResult(id, request));
    }
}
