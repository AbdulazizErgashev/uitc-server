import { prisma } from "../../prisma/prisma.js";

// Get all companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single company
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create company
export const createCompany = async (req, res) => {
  try {
    const { name, color } = req.body;
    const company = await prisma.company.create({ data: { name, color } });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { name, color },
    });
    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.company.delete({ where: { id } });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
