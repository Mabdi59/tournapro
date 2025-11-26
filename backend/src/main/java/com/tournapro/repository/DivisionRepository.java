package com.tournapro.repository;

import com.tournapro.entity.Division;
import com.tournapro.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DivisionRepository extends JpaRepository<Division, Long> {
    List<Division> findByTournament(Tournament tournament);
}
