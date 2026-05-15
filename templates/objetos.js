const amigos =[
    {nombre: "Juan", apellidos: "Cardenaz Perez", edad: 30,},
    {nombre: "Maria", apellidos: "Torres Quintana", edad: 21,},
    {nombre: "Enrique", apellidos: "Mendoza prieto", edad: 22,},
    {nombre: "Pepe", apellidos: "Almeyda Quispe", edad: 23,},
    {nombre: "Steven", apellidos: "Avalos Torres", edad: 25,},
]

const listaAmigos = amigos.map(amigo => `${amigo.nombre} ${amigo.apellidos} tiene ${amigo.edad} años`).join('\n')
console.log(listaAmigos)