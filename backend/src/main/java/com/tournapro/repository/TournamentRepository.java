package com.tournapro.repository;

import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    // all tournaments for a given owner, newest first
    List<Tournament> findByOwnerOrderByCreatedAtDesc(User owner);

    // Used to make sure users only touch their own tournaments
    Optional<Tournament> findByIdAndOwner(Long id, User owner);
}
