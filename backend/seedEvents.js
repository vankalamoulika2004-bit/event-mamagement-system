const dotenv = require("dotenv");
dotenv.config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Event = require("./models/Event");

const collegeEvents = [
  // 1. CULTURAL EVENTS
  {
    title: "Dance Competition",
    category: "Cultural Events",
    date: "2026-10-15",
    time: "02:00 PM",
    location: "Main Auditorium",
    description: "Showcase your rhythm and graceful moves in solo and group dance performances.",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 100,
    status: "Open"
  },
  {
    title: "Singing Competition",
    category: "Cultural Events",
    date: "2026-10-16",
    time: "03:00 PM",
    location: "Open Air Theatre",
    description: "Vocal music talent hunt featuring classical, western, and pop categories.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 80,
    status: "Open"
  },
  {
    title: "Drama Competition",
    category: "Cultural Events",
    date: "2026-10-17",
    time: "11:00 AM",
    location: "Auditorium Stage B",
    description: "Inter-department theatrical plays, skits, and street play performances.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    price: 300,
    maxParticipants: 60,
    status: "Open"
  },
  {
    title: "Rangoli Competition",
    category: "Cultural Events",
    date: "2026-10-18",
    time: "10:00 AM",
    location: "Central Courtyard",
    description: "Vibrant traditional art contest bringing colors and themes to life on campus.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 120,
    status: "Open"
  },
  {
    title: "Short Film Competition",
    category: "Cultural Events",
    date: "2026-10-19",
    time: "04:00 PM",
    location: "Seminar Hall 1",
    description: "Screening of student-directed short movies, documentaries, and creative stories.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    price: 300,
    maxParticipants: 50,
    status: "Open"
  },

  // 2. TECHNICAL EVENTS
  {
    title: "Coding Contest",
    category: "Technical Events",
    date: "2026-11-05",
    time: "09:30 AM",
    location: "Computer Center Lab 3",
    description: "Competitive algorithmic coding challenge testing speed, accuracy, and problem-solving.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
    price: 500,
    maxParticipants: 150,
    status: "Open"
  },
  {
    title: "Hackathon",
    category: "Technical Events",
    date: "2026-11-06",
    time: "08:00 AM",
    location: "Incubation Hub",
    description: "24-hour continuous hackathon to prototype AI, Web3, and IoT software solutions.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    price: 1000,
    maxParticipants: 200,
    status: "Open"
  },
  {
    title: "Project Expo",
    category: "Technical Events",
    date: "2026-11-07",
    time: "10:00 AM",
    location: "Exhibition Pavilion",
    description: "Exhibition of engineering prototypes, hardware models, and innovative projects.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
    price: 300,
    maxParticipants: 100,
    status: "Open"
  },
  {
    title: "Technical Quiz",
    category: "Technical Events",
    date: "2026-11-08",
    time: "02:00 PM",
    location: "Conference Room A",
    description: "Fast-paced trivia competition covering computer science, robotics, and emerging tech.",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 100,
    status: "Open"
  },

  // 3. ACADEMIC EVENTS
  {
    title: "Seminar",
    category: "Academic Events",
    date: "2026-11-15",
    time: "10:00 AM",
    location: "Main Auditorium",
    description: "Academic summit featuring research keynotes and industry expert panel discussions.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 250,
    status: "Open"
  },
  {
    title: "Workshop",
    category: "Academic Events",
    date: "2026-11-16",
    time: "09:00 AM",
    location: "Lab Complex Block C",
    description: "Hands-on training session covering Machine Learning models and Cloud Architecture.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    price: 500,
    maxParticipants: 120,
    status: "Open"
  },
  {
    title: "Guest Lecture",
    category: "Academic Events",
    date: "2026-11-17",
    time: "11:30 AM",
    location: "Audio Visual Hall",
    description: "Distinguished lecture delivered by international scientists and industry leaders.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 200,
    status: "Open"
  },
  {
    title: "Paper Presentation",
    category: "Academic Events",
    date: "2026-11-18",
    time: "01:30 PM",
    location: "Research Wing Hall 2",
    description: "Student research paper presentations evaluated by academic journal peer reviewers.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    price: 300,
    maxParticipants: 80,
    status: "Open"
  },

  // 4. SPORTS EVENTS
  {
    title: "Cricket Tournament",
    category: "Sports Events",
    date: "2026-12-01",
    time: "08:00 AM",
    location: "College Sports Ground",
    description: "Inter-college T20 cricket tournament for championship trophy and prize money.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
    price: 2000,
    maxParticipants: 160,
    status: "Open"
  },
  {
    title: "Chess Tournament",
    category: "Sports Events",
    date: "2026-12-02",
    time: "10:00 AM",
    location: "Indoor Sports Complex",
    description: "FIDE-rated blitz and rapid chess championship for tactical minds.",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800&auto=format&fit=crop",
    price: 300,
    maxParticipants: 100,
    status: "Open"
  },
  {
    title: "Kabaddi Competition",
    category: "Sports Events",
    date: "2026-12-03",
    time: "03:00 PM",
    location: "Kabaddi Mat Arena",
    description: "High-intensity collegiate kabaddi tournament testing strength and teamwork.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=800&auto=format&fit=crop",
    price: 2000,
    maxParticipants: 140,
    status: "Open"
  },
  {
    title: "Badminton Competition",
    category: "Sports Events",
    date: "2026-12-04",
    time: "09:00 AM",
    location: "Wooden Court 1 & 2",
    description: "Singles and doubles badminton knockout matches with professional refereeing.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
    price: 500,
    maxParticipants: 90,
    status: "Open"
  },

  // 5. ARTS AND LITERATURE EVENTS
  {
    title: "Essay Writing",
    category: "Arts and Literature Events",
    date: "2026-12-10",
    time: "11:00 AM",
    location: "Humanities Block Room 101",
    description: "Creative prose and analytical essay writing competition on modern societal themes.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 100,
    status: "Open"
  },
  {
    title: "Poetry Competition",
    category: "Arts and Literature Events",
    date: "2026-12-11",
    time: "02:30 PM",
    location: "Literary Club Lounge",
    description: "Recitation and original poem composition contest celebrating verse and melody.",
    image: "https://images.unsplash.com/photo-1474939557548-f842486be195?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 80,
    status: "Open"
  },
  {
    title: "Drawing Competition",
    category: "Arts and Literature Events",
    date: "2026-12-12",
    time: "10:00 AM",
    location: "Art & Sculpture Studio",
    description: "Fine arts competition covering sketching, watercolor painting, and digital art.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    price: 200,
    maxParticipants: 100,
    status: "Open"
  },
  {
    title: "Poster Presentation",
    category: "Arts and Literature Events",
    date: "2026-12-13",
    time: "01:00 PM",
    location: "Central Library Foyer",
    description: "Visual communication contest showcasing creative posters on social and tech themes.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
    price: 300,
    maxParticipants: 90,
    status: "Open"
  },

  // 6. SOCIAL AND ENVIRONMENTAL EVENTS
  {
    title: "Tree Plantation Drive",
    category: "Social and Environmental Events",
    date: "2026-12-18",
    time: "08:00 AM",
    location: "Campus Green Belt",
    description: "Community eco-initiative focused on planting 500+ saplings to expand green cover.",
    image: "https://media.istockphoto.com/id/2221018480/photo/two-people-are-planting-a-tree-in-the-dirt.webp?a=1&b=1&s=612x612&w=0&k=20&c=_CCyjgyhw0tFf0Dl8OGZlXizCr7QOuGwXO7ujY8zEzM=",
    price: 100,
    maxParticipants: 300,
    status: "Open"
  },
  {
    title: "Blood Donation Camp",
    category: "Social and Environmental Events",
    date: "2026-12-19",
    time: "09:00 AM",
    location: "Medical Center Pavilion",
    description: "Voluntary blood donation drive conducted in association with Red Cross Society.",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=800&auto=format&fit=crop",
    price: 100,
    maxParticipants: 250,
    status: "Open"
  },
  {
    title: "Swachh Bharat Campaign",
    category: "Social and Environmental Events",
    date: "2026-12-20",
    time: "07:30 AM",
    location: "Campus Perimeter & Neighborhood",
    description: "Cleanliness drive and hygiene awareness rally promoting zero-waste practices.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
    price: 100,
    maxParticipants: 200,
    status: "Open"
  },
  {
    title: "Plastic-Free Campus",
    category: "Social and Environmental Events",
    date: "2026-12-21",
    time: "10:30 AM",
    location: "Student Activity Center",
    description: "Campaign distributing cloth bags and raising awareness to eliminate single-use plastics.",
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=800&auto=format&fit=crop",
    price: 100,
    maxParticipants: 200,
    status: "Open"
  }
];

async function seedEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas.");

    for (const evtData of collegeEvents) {
      await Event.findOneAndUpdate(
        { title: evtData.title },
        evtData,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`✓ Seeded/Updated: "${evtData.title}" (${evtData.category}) - ₹${evtData.price}`);
    }

    const count = await Event.countDocuments();
    console.log(`\n=== SUCCESSFULLY SEEDED ALL ${collegeEvents.length} COLLEGE EVENTS ===`);
    console.log(`Total events currently in MongoDB: ${count}`);
  } catch (err) {
    console.error("❌ Error seeding college events:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedEvents();
