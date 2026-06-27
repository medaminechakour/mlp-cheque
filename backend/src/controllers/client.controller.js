const prisma = require("../db");


const getAll = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      data: clients,
      total: clients.length
    });
  } catch (err) {
    console.error("Erreur getAll clients:", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};


const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client non trouvé"
      });
    }

    res.json({ success: true, data: client });
  } catch (err) {
    console.error("Erreur getOne client:", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};


const create = async (req, res) => {
  try {
    const { raisonSociale, ice, email, telephone, adresse, ville } = req.body;

    // --- Validation ---
    if (!raisonSociale || raisonSociale.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "La raison sociale est obligatoire"
      });
    }

    if (ice) {
      const existing = await prisma.client.findUnique({
        where: { ice }
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: "Un client avec cet ICE existe déjà"
        });
      }
    }

    const client = await prisma.client.create({
      data: {
        raisonSociale: raisonSociale.trim(),
        ice: ice || null,
        email: email || null,
        telephone: telephone || null,
        adresse: adresse || null,
        ville: ville || null
      }
    });

    res.status(201).json({
      success: true,
      message: "Client créé avec succès",
      data: client
    });
  } catch (err) {
    console.error("Erreur create client:", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};


const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { raisonSociale, ice, email, telephone, adresse, ville } = req.body;

    // --- Vérifier que le client existe ---
    const existing = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Client non trouvé"
      });
    }

    if (raisonSociale !== undefined && raisonSociale.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "La raison sociale ne peut pas être vide"
      });
    }

    if (ice) {
      const iceExists = await prisma.client.findUnique({
        where: { ice }
      });
      if (iceExists && iceExists.id !== parseInt(id)) {
        return res.status(409).json({
          success: false,
          error: "Cet ICE est déjà utilisé par un autre client"
        });
      }
    }

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        raisonSociale: raisonSociale !== undefined ? raisonSociale.trim() : existing.raisonSociale,
        ice: ice !== undefined ? ice : existing.ice,
        email: email !== undefined ? email : existing.email,
        telephone: telephone !== undefined ? telephone : existing.telephone,
        adresse: adresse !== undefined ? adresse : existing.adresse,
        ville: ville !== undefined ? ville : existing.ville
      }
    });

    res.json({
      success: true,
      message: "Client modifié avec succès",
      data: client
    });
  } catch (err) {
    console.error("Erreur update client:", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};


const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Client non trouvé"
      });
    }

    await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Client supprimé avec succès"
    });
  } catch (err) {
    console.error("Erreur delete client:", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

module.exports = { getAll, getOne, create, update, remove };