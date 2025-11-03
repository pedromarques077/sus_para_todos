import { db } from "./db";
import { hospitals, specialties, news } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const hospitalsData = [
    {
      name: "Hospital Municipal de São Caetano",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 4229-1234",
    },
    {
      name: "Hospital Dr. Manoel de Abreu",
      address: "Av. Goiás, 1000 - Barcelona",
      phone: "(11) 4229-5678",
    },
    {
      name: "UPA 24h São Caetano",
      address: "Rua Amazonas, 500 - Fundação",
      phone: "(11) 4229-9012",
    },
  ];

const specialtiesData = [
  { name: "Cardiologia" },
  { name: "Ortopedia" },
  { name: "Pediatria" },
  { name: "Ginecologia" },
  { name: "Dermatologia" },
  { name: "Oftalmologia" },
  { name: "Neurologia" },
  { name: "Clínico Geral" },
  { name: "Endocrinologia" },
  { name: "Gastroenterologia" },
  { name: "Nefrologia" },
  { name: "Urologia" },
  { name: "Oncologia" },
  { name: "Reumatologia" },
  { name: "Psiquiatria" },
  { name: "Otorrinolaringologia" },
  { name: "Hematologia" },
  { name: "Infectologia" },
  { name: "Pneumologia" },
  { name: "Angiologia" },
  { name: "Cirurgia Geral" },
  { name: "Cirurgia Plástica" },
  { name: "Cirurgia Vascular" },
  { name: "Medicina do Trabalho" },
  { name: "Medicina Esportiva" },
  { name: "Nutrologia" },
  { name: "Fisiatria" },
  { name: "Alergologia e Imunologia" },
  { name: "Geriatria" },
  { name: "Radiologia" },
  { name: "Patologia" },
  { name: "Anestesiologia" },
  { name: "Mastologia" },
  { name: "Proctologia" },
  { name: "Toxicologia" },
  { name: "Genética Médica" },
];

  const newsData = [
    {
      title: "Nova Campanha de Vacinação contra a Gripe",
      summary:
        "A Secretaria de Saúde anuncia o início da campanha de vacinação contra a gripe para idosos e grupos prioritários. Atendimento disponível em todas as unidades.",
      content:
        "A partir desta semana, todas as unidades de saúde de São Caetano do Sul estarão realizando a vacinação contra a gripe. A campanha prioriza idosos acima de 60 anos, gestantes, crianças de 6 meses a 5 anos, e pessoas com doenças crônicas.",
      category: "Vacinação",
    },
    {
      title: "Dicas para Prevenir Doenças Cardiovasculares",
      summary:
        "Especialistas compartilham orientações importantes sobre alimentação saudável, exercícios físicos e check-ups regulares para cuidar do coração.",
      content:
        "Manter uma alimentação equilibrada, praticar exercícios regularmente e realizar check-ups periódicos são medidas essenciais para prevenir doenças cardiovasculares. Consulte seu cardiologista regularmente.",
      category: "Prevenção",
    },
    {
      title: "Novos Horários de Atendimento nos Hospitais",
      summary:
        "A partir desta semana, os hospitais de São Caetano do Sul ampliam horários de atendimento para melhor atender a população.",
      content:
        "Os hospitais municipais agora funcionam com horário estendido das 7h às 20h de segunda a sexta-feira, e das 8h às 14h aos sábados. A UPA 24h continua com atendimento ininterrupto.",
      category: "Atendimento",
    },
    {
      title: "Importância do Check-up Regular",
      summary:
        "Médicos reforçam a necessidade de realizar exames de rotina para detectar doenças precocemente e manter a saúde em dia.",
      content:
        "Realizar exames de rotina anualmente pode salvar vidas. Check-ups regulares permitem detectar doenças em estágios iniciais, quando o tratamento é mais eficaz.",
      category: "Saúde",
    },
    {
      title: "Campanha de Conscientização sobre Diabetes",
      summary:
        "Ações educativas sobre prevenção e controle do diabetes serão realizadas nas unidades de saúde durante todo o mês.",
      content:
        "Durante este mês, as unidades de saúde realizarão palestras e orientações sobre diabetes. Aprenda a prevenir e controlar esta doença que afeta milhões de brasileiros.",
      category: "Prevenção",
    },
    {
      title: "Novo Equipamento de Ressonância Magnética",
      summary:
        "Hospital Municipal recebe novo equipamento de última geração para exames de ressonância magnética, reduzindo tempo de espera.",
      content:
        "O Hospital Municipal de São Caetano acaba de receber um equipamento de ressonância magnética de última geração, que permitirá realizar mais exames com maior precisão e menor tempo de espera.",
      category: "Tecnologia",
    },
  ];

  try {
    const existingHospitals = await db.select().from(hospitals);
    if (existingHospitals.length === 0) {
      await db.insert(hospitals).values(hospitalsData);
      console.log("✓ Hospitais inseridos");
    }

    const existingSpecialties = await db.select().from(specialties);
    if (existingSpecialties.length === 0) {
      await db.insert(specialties).values(specialtiesData);
      console.log("✓ Especialidades inseridas");
    }

    const existingNews = await db.select().from(news);
    if (existingNews.length === 0) {
      await db.insert(news).values(newsData);
      console.log("✓ Notícias inseridas");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
