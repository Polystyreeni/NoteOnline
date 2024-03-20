package fi.tuni.sepro.noteonline.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.tuni.sepro.noteonline.models.ERole;
import fi.tuni.sepro.noteonline.models.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{
    Optional<Role> findByRoleName(ERole roleName);
}
