import bcrypt from 'bcryptjs';

// Contraseña original
const password = '031092';

// Hashear la contraseña
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;

    // Imprime el hash
    console.log('Hash generado:', hash);

    // Compara el hash con el hash almacenado en la base de datos
    const storedHash = '$2a$10$898ymkQFTwUXsy5Dx.53v.AEva6.8FeBHZiuHYgviriJ5NBHYPFyS';
    bcrypt.compare(password, storedHash, (err, isMatch) => {
      if (err) throw err;
      console.log('Coincidencia de contraseña:', isMatch);
    });
  });
});
console.log("prueba de bcrypt");

const salt = await bcrypt.genSalt(10);
console.log('Salt generado:', salt);

const hashedPassword = await bcrypt.hash(password, salt);
console.log('Password hasheada:', hashedPassword);

const isMatch = await bcrypt.compare(password, hashedPassword);
console.log('Prueba de comparación de contraseña:', isMatch);
