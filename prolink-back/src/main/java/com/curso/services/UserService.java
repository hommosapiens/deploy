package com.curso.services;

import com.curso.domain.model.User;

import java.util.List;
import java.util.Optional;


public interface UserService {
    
    /**
     * Recupera todos los usuarios del sistema
     * @return Lista de usuarios
     */
    List<User> findAll();

    /**
     * Busca un usuario por su ID
     * @param id ID del usuario
     * @return Optional con el usuario si existe
     */
    Optional<User> findById(Long id);

    /**
     * Guarda un nuevo usuario o actualiza uno existente
     * @param user Usuario a guardar
     * @return Usuario guardado
     */
    User save(User user);

    /**
     * Elimina un usuario por su ID
     * @param id ID del usuario a eliminar
     */
    void deleteById(Long id);


    /**
     * Verifica si existe un usuario con el ID especificado
     * @param id ID a verificar
     * @return true si existe, false si no
     */
    boolean existsById(Long id);

    /**
     * Actualiza los datos de un usuario existente
     * @param user Usuario con los datos actualizados
     */
    void updateUser(User user);
}