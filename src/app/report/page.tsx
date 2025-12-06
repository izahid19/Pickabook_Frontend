import React from "react";
import MermaidDiagram from "@/components/MermaidDiagram";
import Link from "next/link";
import { ExternalLink, Phone, Linkedin, Calendar, Database } from "lucide-react";

export default function ReportPage() {
  const chart = `
    graph TD
        User([User]) -->|"Uploads Image"| Client["Frontend (Next.js/React)"]
        
        subgraph "Frontend Logic"
            Client -->|"Auth Check"| Auth["Auth Context"]
            Client -->|"File Select"| Upload["Upload Zone"]
        end

        Client -->|"POST /generate (Image + Token)"| API["Backend (Node.js/Express)"]

        subgraph "Backend_Infrastructure"
            API -->|"Verify Token"| Middleware["Auth Middleware"]
            API -->|"Check/Deduct Credits"| DB[("MongoDB Atlas")]
            API -->|"Forward Image (Base64)"| Replicate["Replicate API"]
        end

        subgraph "AI_inference"
            Replicate -->|"Process"| Model["Model: black-forest-labs/flux-kontext-pro"]
            Model -->|"Generate Illustration"| Output["Image URL"]
        end

        Output -->|"Return URL"| API
        API -->|"JSON Response"| Client
        Client -->|"Display"| Result["Result Component"]
  `;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold border-b pb-4 mb-8 text-gray-900 leading-tight">
          Pickabook Technical Assignment: AI Personalisation Prototype
        </h1>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-8 flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <span className="font-semibold w-28 inline-block">Submitted by:</span> Zahid Mushtaq
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold w-28 inline-block">LinkedIn:</span>
            <Link
              href="https://www.linkedin.com/in/zahidmushtaq045/"
              target="_blank"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Linkedin className="w-4 h-4" /> linkedin.com/in/zahidmushtaq045
            </Link>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold w-28 inline-block">Phone:</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> +917006066507</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold w-28 inline-block">Date:</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> 08 December 2025</span>
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 mt-8">1. Project Overview</h2>
          <p className="mb-4 leading-relaxed">
            This prototype implements an end-to-end system where a user can upload a photo (e.g., a child's photo) and transform it into a stylized 3D illustrated character (Disney/Pixar style). The system handles file uploads, processes the image using a robust AI pipeline, and manages user credits.
          </p>

          <p className="mb-2 font-semibold">Repo Links:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Frontend:</strong> <Link href="https://github.com/izahid19/Pickabook_Frontend" target="_blank" className="text-blue-600 hover:underline ml-1">github.com/izahid19/Pickabook_Frontend</Link>
            </li>
            <li>
              <strong>Backend:</strong> <Link href="https://github.com/izahid19/PickaBook_Backend" target="_blank" className="text-blue-600 hover:underline ml-1">github.com/izahid19/PickaBook_Backend</Link>
            </li>
            <li>
              <strong>Live Demo:</strong> <Link href="https://pickabook.vercel.app" target="_blank" className="text-blue-600 hover:underline ml-1">pickabook.vercel.app</Link>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 mt-8">2. Architecture Diagram</h2>
          <p className="mb-4">The system follows a modern client-server architecture with a dedicated AI inference layer.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden my-6">
            <MermaidDiagram chart={chart} />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 mt-8">3. Technology Stack</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Frontend</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Framework:</strong> Next.js (React)</li>
            <li><strong>Styling:</strong> Tailwind CSS + Custom CSS (Glassmorphism, Gradients)</li>
            <li><strong>Animations:</strong> GSAP (GreenSock) for hero/scroll animations, custom CSS spinners.</li>
            <li><strong>State Management:</strong> React Context (AuthContext).</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Backend</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Runtime:</strong> Node.js</li>
            <li><strong>Framework:</strong> Express.js</li>
            <li><strong>Database:</strong> MongoDB (User data, Credits).</li>
            <li><strong>Authentication:</strong> JWT (JSON Web Tokens).</li>
            <li><strong>File Handling:</strong> Multer (Temporary storage for processing).</li>
          </ul>

           <h3 className="text-xl font-semibold mt-4 mb-2">AI Pipeline</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Platform:</strong> Replicate</li>
            <li><strong>Model:</strong> <code className="bg-gray-100 text-sm px-1 py-0.5 rounded">black-forest-labs/flux-kontext-pro</code></li>
            <li><strong>Reasoning:</strong> High fidelity, excellent understanding of "Pixar/Disney 3D" prompts, and robust face structure preservation compared to vanilla SDXL.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 mt-8">4. Model Choice & Implementation Details</h2>
          <p className="mb-2">I selected <strong>Flux Kontext Pro</strong> (via Replicate) as the core generation engine.</p>
          
          <ul className="list-disc pl-6 space-y-4 mb-4">
            <li>
                <strong>Why Flux?</strong>
                <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-700">
                    <li><strong>Quality:</strong> Flux currently outperforms SDXL and standard Stable Diffusion 1.5 in generating coherent, aesthetically pleasing 3D/CGI style images without extensive fine-tuning.</li>
                    <li><strong>Prompt Adherence:</strong> It strongly focuses on the style keywords provided ("soft 3d render", "disney pixar style", "unreal engine 5 render").</li>
                    <li><strong>Simplicity:</strong> It avoids the complexity of setting up a custom ControlNet pipeline manually for a rapid prototype while delivering superior results.</li>
                </ul>
            </li>
             <li>
                <strong>Pipeline Flow:</strong>
                <ol className="list-decimal pl-6 mt-1 space-y-1 text-gray-700">
                    <li>Image is converted to Base64 in the backend.</li>
                    <li>Sent to Replicate with a fixed style prompt: <em>"soft 3d render, disney pixar style, cute 3d character, cinematic lighting, 8k..."</em>.</li>
                    <li>The model uses <code className="bg-gray-100 text-sm px-1 py-0.5 rounded">match_input_image</code> aspect ratio to preserve composition.</li>
                    <li>Resulting URL is returned to the frontend.</li>
                </ol>
            </li>
          </ul>
        </section>

        <section className="mb-10">
           <h2 className="text-2xl font-semibold border-b pb-2 mb-4 mt-8">5. Limitations</h2>
           <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li><strong>Latency:</strong> The generation process takes approximately 20-30 seconds. This is inherent to high-quality diffusion models but can feel slow for users expecting "instant" results.</li>
                <li><strong>Cost:</strong> Each API call to Replicate incurs a cost. A production system would need a strict credit system (implemented in this prototype) or a dedicated GPU cluster to lower unit economics.</li>
                <li><strong>Style Rigidity:</strong> The current prompt is hardcoded in the backend. Users cannot currently choose different styles (e.g., "Watercolor", "Sketch").</li>
                <li><strong>Face Identity:</strong> While Flux is good, it is not a dedicated identity-preserving model like <em>InstantID</em>. Sometimes the "likeness" might shift towards a generic cartoon face rather than the specific child's features.</li>
           </ol>
        </section>

        <section className="mb-10">
           <h2 className="text-2xl font-semibold border-b pb-2 mb-4 mt-8">6. v2 Improvements (Roadmap)</h2>
            <p className="mb-4">For the next version (v2), I would propose the following upgrades:</p>
            <ol className="list-decimal pl-6 space-y-4 mb-4">
                <li>
                    <strong>Implement InstantID / IP-Adapter:</strong>
                     <ul className="list-circle pl-6 mt-1 text-gray-700">
                        <li>To guarantee the illustrated face looks exactly like the uploaded child, I would switch to a pipeline using <strong>InstantID</strong> or <strong>ControlNet (Canny/Depth)</strong>. This would map the facial landmarks precisely onto the 3D character.</li>
                    </ul>
                </li>
                <li>
                    <strong>Async Queue System:</strong>
                     <ul className="list-circle pl-6 mt-1 text-gray-700">
                        <li>Move generation to a background worker (e.g., BullMQ + Redis). The frontend would poll for status or receive a webhook, preventing timeout issues on long-running requests.</li>
                    </ul>
                </li>
                <li>
                    <strong>User-Selectable Styles:</strong>
                     <ul className="list-circle pl-6 mt-1 text-gray-700">
                        <li>Allow users to pick from "Pixar", "Anime", or "Hand-drawn" styles. The backend would dynamically inject these keywords into the prompt.</li>
                    </ul>
                </li>
                <li>
                    <strong>Image Editing Tools:</strong>
                     <ul className="list-circle pl-6 mt-1 text-gray-700">
                        <li>Add a simple internal canvas (Canvas API) allowing users to crop/rotate their photo before upload for better results.</li>
                    </ul>
                </li>
                 <li>
                    <strong>Result Caching:</strong>
                     <ul className="list-circle pl-6 mt-1 text-gray-700">
                        <li>Store generated images in S3 (or similar) instead of relying on Replicate's temporary URLs to ensure long-term availability.</li>
                    </ul>
                </li>
            </ol>
        </section>

      </div>
    </div>
  );
}
