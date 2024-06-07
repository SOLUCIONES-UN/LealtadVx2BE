const { Op } = require("sequelize");
const { Menu } = require("../models/menu");
const { Pagina } = require("../models/pagina");
const { permisoUsuario } = require("../models/permisoUsuario");
const { Rol } = require("../models/rol");
const { Usuario } = require("../models/usuario");
const { Proyectos } = require("../models/proyectos.model");
const addPermiso = async (req, res) => {
  let { data } = req.body;
  console.log(data, "acaa 1");

  try {
    data.forEach((element, index) => {
      data[index].fechaAsignacion = new Date();
    });

    await permisoUsuario.bulkCreate(data);

    res.json({ code: "ok", message: "Permiso creado con exito." });
  } catch (error) {
    console.log(error);
    res.status(403);
    res.send({
      errors:
        "Ha sucedido un  error al intentar crear el permiso.",
    });
  }
};

const getPermisos = async (req, res) => {
  const { username } = req.params;

  try { 

    const usuario = await Usuario.findByPk(username);

    const menus = await Menu.findAll({
      attributes: ["id", "descripcion"],
      where: {
        estado: 1,
      },
      include: {
        model: Pagina,
        attributes: ["id", "descripcion", "path", "icono"],
        include: {
          model: permisoUsuario,
          attributes: [],
          where: {
            idRol: usuario.idRol,
          },
        },
      },
    });

    let newPaginas = menus.filter((x) => x.paginas.length > 0);

    res.json(newPaginas);
  } catch (error) {
    console.error(error);
    res.status(403);
    res.send({
      errors: "Ha sucedido un error al intentar realizar la consulta.",
    });
  }
};

const getNoAsignados = async (req, res) => {
  try {
    const { idMenu, idRol } = req.body;

    const paginasact = await permisoUsuario.findAll({
      include: {
        model: Pagina,
        where: {
          idMenu: idMenu,
        },
      },
      where: {
        idRol: idRol,
      },
    });

    let paginasAsigandas = [];
    paginasact.forEach((element) => {
      paginasAsigandas.push(element.idPagina);
    });

    const trx = await Pagina.findAll({
      include: {
        model: Menu,
        where: {
          id: idMenu,
        },
      },
      where: {
        estado: 1,
        id: {
          [Op.notIn]: paginasAsigandas,
        },
      },
    });

    res.json(trx);
  } catch (error) {
    console.error(error);
    res.status(403);
    res.send({
      errors: "Ha sucedido un  error al intentar obtener la lista de páginas.",
    });
  }
};

const getAsignados = async (req, res) => {
  try {
    const { idMenu, idRol } = req.body;

    const paginasact = await permisoUsuario.findAll({
      include: {
        model: Pagina,

        where: {
          idMenu: idMenu,
        },
      },
      where: {
        idRol: idRol,
      },
    });

    console.log(idMenu, idRol);
    res.json(paginasact);
  } catch (error) {
    console.error(error);
    res.status(403);
    res.send({
      errors: "Ha sucedido un  error al intentar obtener la lista de páginas.",
    });
  }
};

const deletePermisos = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id, "acaaaaa");
    await permisoUsuario.destroy({
      where: {
        id: {
          [Op.in]: id,
        },
      },
    });

    res.json({ code: "ok", message: "Permiso elimninado con exito" });
  } catch (error) {
    res.status(403);
    res.send({
      errors: "Ha sucedido un  error al intentar eliminar el permiso.",
    });
  }
};

module.exports = {
  addPermiso,
  getPermisos,
  getNoAsignados,
  getAsignados,
  deletePermisos,
};
