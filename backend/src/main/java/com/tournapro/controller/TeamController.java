package com.tournapro.controller;

import com.tournapro.dto.CreateTeamRequest;
import com.tournapro.dto.TeamResponse;
import com.tournapro.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}/teams")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            @PathVariable Long tournamentId,
            @Valid @RequestBody CreateTeamRequest request
    ) {
        return ResponseEntity.ok(teamService.createTeam(tournamentId, request));
    }

    // Bulk create (multiple teams at once)
    @PostMapping("/bulk")
    public ResponseEntity<List<TeamResponse>> bulkCreate(
            @PathVariable Long tournamentId,
            @Valid @RequestBody List<CreateTeamRequest> requests
    ) {
        List<TeamResponse> created = teamService.bulkCreate(tournamentId, requests);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> getTeams(
            @PathVariable Long tournamentId
    ) {
        return ResponseEntity.ok(teamService.getTeams(tournamentId));
    }

    // paged listing
    @GetMapping("/paged")
    public ResponseEntity<Page<TeamResponse>> getTeamsPaged(
            @PathVariable Long tournamentId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "25") int size
    ) {
        return ResponseEntity.ok(teamService.getTeamsPaged(tournamentId, page, size));
    }

    @RequestMapping(value = "/{teamId}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<TeamResponse> updateTeam(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId,
            @RequestBody CreateTeamRequest request
    ) {
        return ResponseEntity.ok(teamService.updateTeam(tournamentId, teamId, request));
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId
    ) {
        teamService.deleteTeam(tournamentId, teamId);
        return ResponseEntity.noContent().build();
    }

    // NEW: Upload team logo via multipart/form-data. Returns updated TeamResponse with logoUrl
    @PostMapping(value = "/{teamId}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeamResponse> uploadLogo(
            @PathVariable Long tournamentId,
            @PathVariable Long teamId,
            @RequestPart(name = "file") MultipartFile file
    ) throws IOException {
        TeamResponse updated = teamService.uploadLogo(tournamentId, teamId, file);
        return ResponseEntity.ok(updated);
    }
}
