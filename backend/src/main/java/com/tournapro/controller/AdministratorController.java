package com.tournapro.controller;

import com.tournapro.dto.AdministratorResponse;
import com.tournapro.dto.CreateAdministratorRequest;
import com.tournapro.service.AdministratorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}/administrators")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdministratorController {

    private final AdministratorService service;

    public AdministratorController(AdministratorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AdministratorResponse> addAdmin(
            @PathVariable Long tournamentId,
            @Valid @RequestBody CreateAdministratorRequest request
    ) {
        return ResponseEntity.ok(service.addAdministrator(tournamentId, request));
    }

    @GetMapping
    public ResponseEntity<List<AdministratorResponse>> listAdmins(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(service.listAdministrators(tournamentId));
    }

    @DeleteMapping("/{adminId}")
    public ResponseEntity<Void> removeAdmin(@PathVariable Long tournamentId, @PathVariable Long adminId) {
        service.removeAdministrator(tournamentId, adminId);
        return ResponseEntity.noContent().build();
    }
}

