import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDg_-xt-PK-sPTUQzc9fic_4_Tp15GVtxs",
    authDomain: "portfolioadmin-7fff5.firebaseapp.com",
    projectId: "portfolioadmin-7fff5",
    storageBucket: "portfolioadmin-7fff5.firebasestorage.app",
    messagingSenderId: "680407070022",
    appId: "1:680407070022:web:b0a9d86860b0d0762ee147"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(name) {
    const snap = await getDocs(collection(db, name));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    console.log(`✅ Cleared "${name}"`);
}

async function seed() {
    // ── EXPERIENCE ──────────────────────────────────────────────────────────
    await clearCollection("experience");

    const experiences = [
        // Work
        {
            type: "work",
            role: "Trainee Assistant",
            organization: "Regional Development Bank Kuliyapitiya",
            startDate: "July 2021",
            endDate: "Jan 2022",
            isCurrent: false,
            description: "Assisted with daily banking operations and administrative tasks at the Kuliyapitiya branch.",
        },
        // Volunteering
        {
            type: "volunteering",
            role: "Chairperson",
            organization: "IEEE WIE Student Branch Affinity Group of Rajarata University of Sri Lanka",
            startDate: "Aug 2025",
            endDate: "",
            isCurrent: true,
            description: "Leading the Women in Engineering affinity group, organising events and workshops to empower women in STEM.",
        },
        {
            type: "volunteering",
            role: "Graphic Designer",
            organization: "Infocus Media, Rajarata University of Sri Lanka",
            startDate: "2023",
            endDate: "2026",
            isCurrent: false,
            description: "Designed visual content — posters, flyers and social media creatives — for the university media team.",
        },
        {
            type: "volunteering",
            role: "Director of Media & Marketing",
            organization: "ZeroPlastic, Rajarata University of Sri Lanka",
            startDate: "2025",
            endDate: "2026",
            isCurrent: false,
            description: "Led media strategy and marketing campaigns for the university's environmental awareness initiative.",
        },
        {
            type: "volunteering",
            role: "Web Design Team Member",
            organization: "IEEE Student Branch of Rajarata University of Sri Lanka",
            startDate: "2024",
            endDate: "",
            isCurrent: true,
            description: "Contributing to the design and development of the IEEE student branch website and digital presence.",
        },
        {
            type: "volunteering",
            role: "Graphic Designer",
            organization: "IEEE WIE Student Branch Affinity Group of Rajarata University of Sri Lanka",
            startDate: "2023",
            endDate: "2025",
            isCurrent: false,
            description: "Created visual materials for events and campaigns run by the WIE affinity group.",
        },
        {
            type: "volunteering",
            role: "PR Team Member",
            organization: "Women in FOSS, Rajarata University of Sri Lanka",
            startDate: "2024",
            endDate: "2025",
            isCurrent: false,
            description: "Promoted open-source culture among women through public relations activities and outreach programmes.",
        },
    ];

    for (const exp of experiences) {
        await addDoc(collection(db, "experience"), { ...exp, createdAt: serverTimestamp() });
    }
    console.log(`✅ Seeded ${experiences.length} experience entries`);

    // ── SKILLS ──────────────────────────────────────────────────────────────
    await clearCollection("skills");

    const skills = [
        // Professional Skills
        { type: "skill", name: "UI/UX Design", iconName: "Palette", color: "text-purple-400", description: "Designing user-friendly and visually appealing digital experiences by focusing on usability, user needs, and intuitive interfaces." },
        { type: "skill", name: "Graphic Design", iconName: "PenTool", color: "text-pink-400", description: "Creating visually engaging designs for digital and marketing materials using strong layout, color, and typography principles." },
        { type: "skill", name: "Responsive Interface Design", iconName: "Monitor", color: "text-green-400", description: "Designing interfaces that adapt smoothly across different devices such as mobile, tablet, and desktop." },
        { type: "skill", name: "Interactive User Flows", iconName: "MousePointer2", color: "text-orange-400", description: "Designing clear and logical user journeys that guide users efficiently through digital applications." },
        { type: "skill", name: "Visual Communication", iconName: "MessageSquare", color: "text-yellow-400", description: "Presenting ideas and information visually through layouts, graphics, and design elements to improve understanding." },
        { type: "skill", name: "Media & Marketing Design", iconName: "Megaphone", color: "text-red-400", description: "Creating marketing visuals such as posters, social media content, and promotional materials for digital campaigns." },
        { type: "skill", name: "Frontend Web Development", iconName: "Code2", color: "text-blue-500", description: "Developing the visual and interactive parts of websites using modern web technologies." },
        { type: "skill", name: "Web Design", iconName: "Layout", color: "text-indigo-400", description: "Designing aesthetically pleasing and user-centered website layouts that enhance usability and engagement." },
        { type: "skill", name: "Designing Digital Applications", iconName: "AppWindow", color: "text-cyan-400", description: "Creating design concepts and interfaces for web and mobile applications focusing on usability and functionality." },
        { type: "skill", name: "Leadership", iconName: "Users", color: "text-amber-500", description: "Guiding teams, organizing activities, and motivating members to achieve project goals effectively." },
        { type: "skill", name: "Project Management", iconName: "Briefcase", color: "text-emerald-500", description: "Planning, organizing, and coordinating tasks to ensure projects are completed efficiently and on time." },
        { type: "skill", name: "Communication", iconName: "MessageCircle", color: "text-sky-400", description: "Clearly sharing ideas, information, and feedback to collaborate effectively with teams and stakeholders." },
        { type: "skill", name: "Teamwork", iconName: "Handshake", color: "text-orange-500", description: "Working collaboratively with team members to achieve shared goals and deliver successful projects." },
        { type: "skill", name: "Public Relations", iconName: "Globe", color: "text-rose-400", description: "Building and maintaining positive communication between teams, communities, and organizations." },

        // Tools
        { type: "tool", name: "Figma", iconName: "Figma", color: "text-pink-400", description: "Designing UI/UX interfaces, prototypes, and collaborative design systems for web and mobile applications." },
        { type: "tool", name: "Canva", iconName: "Palette", color: "text-blue-300", description: "Creating quick and effective marketing designs, presentations, and social media graphics." },
        { type: "tool", name: "Adobe Photoshop", iconName: "Image", color: "text-blue-600", description: "Editing images, creating digital graphics, and designing visual content for digital media." },
        { type: "tool", name: "Adobe Illustrator", iconName: "PenTool", color: "text-orange-600", description: "Designing vector graphics, icons, logos, and illustrations with scalable quality." },
        { type: "tool", name: "HTML", iconName: "FileCode", color: "text-orange-500", description: "Building the basic structure of web pages using standard markup language." },
        { type: "tool", name: "CSS", iconName: "FileCode", color: "text-blue-500", description: "Styling web pages with layouts, colors, and responsive design techniques." },
        { type: "tool", name: "JavaScript", iconName: "FileJson", color: "text-yellow-400", description: "Adding interactivity and dynamic functionality to websites and web applications." },
        { type: "tool", name: "Bootstrap", iconName: "Layout", color: "text-purple-600", description: "Developing responsive websites quickly using pre-built UI components and grid systems." },
        { type: "tool", name: "Tailwind CSS", iconName: "Wind", color: "text-cyan-500", description: "Designing modern and responsive interfaces using utility-first CSS framework." },
        { type: "tool", name: "Git", iconName: "GitBranch", color: "text-orange-400", description: "Tracking code changes and managing project versions during development." },
        { type: "tool", name: "GitHub", iconName: "Github", color: "text-white", description: "Collaborating on projects, managing repositories, and sharing code with teams." },
        { type: "tool", name: "Notion", iconName: "Book", color: "text-white", description: "Organizing project tasks, documentation, and workflows for better productivity." },
        { type: "tool", name: "Microsoft Office", iconName: "FileSpreadsheet", color: "text-red-500", description: "Creating professional documents, presentations, and spreadsheets for academic and project work." },
    ];

    for (const skill of skills) {
        await addDoc(collection(db, "skills"), { ...skill, createdAt: serverTimestamp() });
    }
    console.log(`✅ Seeded ${skills.length} skill/tool entries`);

    // ── CERTIFICATES ────────────────────────────────────────────────────────
    await clearCollection("certificates");

    const certs = [
        {
            title: "IEEEXtreme 18.0 Programming Competition – Certificate of Participation",
            issuer: "IEEE",
            date: "Oct 2024",
            description: "Participated in the IEEEXtreme 18.0, a global 24-hour programming competition.",
            link: "https://ieeextreme.org/",
            imageUrl: "",
        },
        {
            title: "Postman API Fundamentals Student Expert",
            issuer: "Postman",
            date: "May 2025",
            description: "Certified as a Postman Student Expert after mastering the fundamentals of API development, testing, and documentation.",
            link: "", // You can add the credential URL here later
            imageUrl: "",
        },
        {
            title: "IEEEXtreme 18.0 RUSLXtreme 1.0 Mini Hackathon",
            issuer: "WIE Affinity Group of IEEE Student Branch of Rajarata University of Sri Lanka",
            date: "Oct 2024",
            description: "Awarded during the RUSLXtreme 1.0 Mini Hackathon organized by the WIE affinity group.",
            link: "",
            imageUrl: "",
        },
    ];

    for (const cert of certs) {
        await addDoc(collection(db, "certificates"), { ...cert, createdAt: serverTimestamp() });
    }
    console.log(`✅ Seeded ${certs.length} certificate entries`);

    console.log("\n🎉 All done! Firebase is fully seeded.");
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
