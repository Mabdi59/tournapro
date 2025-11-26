package com.tournapro.repository;

import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByOrganizer(User organizer);
    List<Tournament> findByStatus(Tournament.TournamentStatus status);
}
