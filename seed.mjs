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
        // Soft skills / professional
        { type: "skill", name: "UI/UX Design", iconName: "Layers", color: "text-purple-400" },
        { type: "skill", name: "Graphic Design", iconName: "PenTool", color: "text-pink-400" },
        { type: "skill", name: "Leadership", iconName: "Users", color: "text-yellow-400" },
        { type: "skill", name: "Project Management", iconName: "ClipboardList", color: "text-green-400" },
        { type: "skill", name: "Communication", iconName: "MessageCircle", color: "text-blue-400" },
        { type: "skill", name: "Teamwork", iconName: "Handshake", color: "text-teal-400" },
        // Tools
        { type: "tool", name: "Figma", iconName: "Figma", color: "text-pink-400" },
        { type: "tool", name: "Adobe Photoshop", iconName: "Image", color: "text-blue-500" },
        { type: "tool", name: "Adobe Lightroom", iconName: "Sun", color: "text-orange-400" },
        { type: "tool", name: "Canva", iconName: "Palette", color: "text-green-400" },
        { type: "tool", name: "React", iconName: "Code2", color: "text-cyan-400" },
        { type: "tool", name: "Tailwind CSS", iconName: "Wind", color: "text-teal-400" },
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
