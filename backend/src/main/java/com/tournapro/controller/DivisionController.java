package com.tournapro.controller;

import com.tournapro.dto.DivisionRequest;
import com.tournapro.entity.Division;
import com.tournapro.service.DivisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}/divisions")
@RequiredArgsConstructor
public class DivisionController {

    private final DivisionService divisionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Division> createDivision(
            @PathVariable Long tournamentId,
            @Valid @RequestBody DivisionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(divisionService.createDivision(tournamentId, request));
    }

    @GetMapping
    public ResponseEntity<List<Division>> getDivisionsByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(divisionService.getDivisionsByTournament(tournamentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Division> getDivisionById(@PathVariable Long id) {
        return ResponseEntity.ok(divisionService.getDivisionById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Division> updateDivision(
            @PathVariable Long id,
            @Valid @RequestBody DivisionRequest request) {
        return ResponseEntity.ok(divisionService.updateDivision(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Void> deleteDivision(@PathVariable Long id) {
        divisionService.deleteDivision(id);
        return ResponseEntity.noContent().build();
    }
}
