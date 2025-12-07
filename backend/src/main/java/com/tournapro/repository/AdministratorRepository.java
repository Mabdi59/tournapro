package com.tournapro.repository;

import com.tournapro.entity.Administrator;
import com.tournapro.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdministratorRepository extends JpaRepository<Administrator, Long> {

    List<Administrator> findByTournamentOrderByCreatedAtDesc(Tournament tournament);

    Optional<Administrator> findByTournamentAndEmailIgnoreCase(Tournament tournament, String email);
}

