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
        { type: "skill", name: "UI/UX Design", iconName: "Palette", color: "text-purple-400", description: "Crafting intuitive and aesthetically pleasing user interfaces and experiences." },
        { type: "skill", name: "Graphic Design", iconName: "PenTool", color: "text-pink-400", description: "Creating impactful visual content for digital and print media." },
        { type: "skill", name: "Responsive Interface Design", iconName: "Monitor", color: "text-green-400", description: "Ensuring seamless user experiences across all device sizes and platforms." },
        { type: "skill", name: "Interactive User Flows", iconName: "MousePointer2", color: "text-orange-400", description: "Designing logical and engaging paths for users to navigate digital products." },
        { type: "skill", name: "Visual Communication", iconName: "MessageSquare", color: "text-yellow-400", description: "Translating complex ideas into clear and effective visual messaging." },
        { type: "skill", name: "Media & Marketing Design", iconName: "Megaphone", color: "text-red-400", description: "Developing creative assets for marketing campaigns and social media." },
        { type: "skill", name: "Frontend Web Development", iconName: "Code2", color: "text-blue-500", description: "Building responsive and performant web applications using modern technologies." },
        { type: "skill", name: "Web Design", iconName: "Layout", color: "text-indigo-400", description: "Designing modern, clean, and professional websites tailored to client needs." },
        { type: "skill", name: "Designing Digital Applications", iconName: "AppWindow", color: "text-cyan-400", description: "End-to-end design of functional and user-centric digital applications." },
        { type: "skill", name: "Leadership", iconName: "Users", color: "text-amber-500", description: "Guiding teams towards project goals through clear vision and effective management." },
        { type: "skill", name: "Project Management", iconName: "Briefcase", color: "text-emerald-500", description: "Overseeing project lifecycles from conception to successful delivery." },
        { type: "skill", name: "Communication", iconName: "MessageCircle", color: "text-sky-400", description: "Facilitating clear and effective information exchange within teams and with clients." },
        { type: "skill", name: "Teamwork", iconName: "Handshake", color: "text-orange-500", description: "Collaborating effectively in diverse environments to achieve shared objectives." },
        { type: "skill", name: "Public Relations", iconName: "Globe", color: "text-rose-400", description: "Managing and maintaining a positive public image for individuals and brands." },

        // Tools
        { type: "tool", name: "Figma", iconName: "Figma", color: "text-pink-400", description: "Interface design and prototyping tool for digital products." },
        { type: "tool", name: "Canva", iconName: "Palette", color: "text-blue-300", description: "Versatile design platform for quick and professional social media content." },
        { type: "tool", name: "Adobe Photoshop", iconName: "Image", color: "text-blue-600", description: "Industry-standard software for image editing and digital art." },
        { type: "tool", name: "Adobe Illustrator", iconName: "PenTool", color: "text-orange-600", description: "Powerful vector graphics software for logos, icons, and illustrations." },
        { type: "tool", name: "HTML", iconName: "FileCode", color: "text-orange-500", description: "The standard markup language for creating the structure of web pages." },
        { type: "tool", name: "CSS", iconName: "FileCode", color: "text-blue-500", description: "Styling language used to create beautiful and responsive web layouts." },
        { type: "tool", name: "JavaScript", iconName: "FileJson", color: "text-yellow-400", description: "Powerful scripting language for adding interactivity to web applications." },
        { type: "tool", name: "Bootstrap", iconName: "Layout", color: "text-purple-600", description: "Front-end framework for rapid development of responsive mobile-first sites." },
        { type: "tool", name: "Tailwind CSS", iconName: "Wind", color: "text-cyan-500", description: "Utility-first CSS framework for building custom designs directly in HTML." },
        { type: "tool", name: "Git", iconName: "GitBranch", color: "text-orange-400", description: "Distributed version control system for tracking changes in source code." },
        { type: "tool", name: "GitHub", iconName: "Github", color: "text-white", description: "Platform for hosting and collaborating on Git repositories." },
        { type: "tool", name: "Notion", iconName: "Book", color: "text-white", description: "All-in-one workspace for notes, tasks, and project organization." },
        { type: "tool", name: "Microsoft Office", iconName: "FileSpreadsheet", color: "text-red-500", description: "Enabling productivity through standardized document and data management tools." },
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
