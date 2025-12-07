package com.tournapro.controller;

import com.tournapro.dto.CreateRefereeRequest;
import com.tournapro.dto.RefereeResponse;
import com.tournapro.service.RefereeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}/referees")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RefereeController {

    private final RefereeService refereeService;

    public RefereeController(RefereeService refereeService) {
        this.refereeService = refereeService;
    }

    @PostMapping
    public ResponseEntity<RefereeResponse> createReferee(
            @PathVariable Long tournamentId,
            @Valid @RequestBody CreateRefereeRequest request
    ) {
        return ResponseEntity.ok(refereeService.createReferee(tournamentId, request));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<RefereeResponse>> bulkCreate(
            @PathVariable Long tournamentId,
            @Valid @RequestBody List<CreateRefereeRequest> requests
    ) {
        return ResponseEntity.ok(refereeService.bulkCreate(tournamentId, requests));
    }

    @GetMapping
    public ResponseEntity<List<RefereeResponse>> listReferees(
            @PathVariable Long tournamentId
    ) {
        return ResponseEntity.ok(refereeService.listReferees(tournamentId));
    }

    @RequestMapping(value = "/{refereeId}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<RefereeResponse> updateReferee(
            @PathVariable Long tournamentId,
            @PathVariable Long refereeId,
            @Valid @RequestBody CreateRefereeRequest request
    ) {
        return ResponseEntity.ok(refereeService.updateReferee(tournamentId, refereeId, request));
    }

    @DeleteMapping("/{refereeId}")
    public ResponseEntity<Void> deleteReferee(
            @PathVariable Long tournamentId,
            @PathVariable Long refereeId
    ) {
        refereeService.deleteReferee(tournamentId, refereeId);
        return ResponseEntity.noContent().build();
    }
}

