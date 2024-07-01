import { type NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { generateText } from 'ai';
import { db } from '~/server/db';
import { openai } from '@ai-sdk/openai';
import { type UserSkill } from '@prisma/client';

const sortSkills = (a: UserSkill, b: UserSkill) => (a.order ?? 0) - (b.order ?? 0);

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  console.log(111111)
  if (!username) {
    return new NextResponse('Missing username', { status: 400 });
  }
  console.log(22222)
  const user = await db.user.findUnique({
    where: { username },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      experiences: true,
      projects: true,
    },
  });

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }
  console.log(3333)

  const doc = new jsPDF();

  console.log(doc.getFontList())
  // Add User Info
  doc.setFont('times', 'bold')
  doc.setFontSize(24);
  doc.text(user.name ?? 'Name not available', 105, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(15);
  doc.setTextColor('#1D90FF')
  doc.text(user.headline ?? 'Headline not available', 105, 26, { align: 'center' });

  doc.setTextColor('#485257')
  doc.setFontSize(12);
  doc.text([user.email, user.website, `github.com/${user.username}`, user.location ?? user.region].filter(Boolean).join(' • '), 105, 32, { align: 'center'});
 
  doc.setFont('times', 'normal')
  doc.setTextColor('#000000')
  doc.setFontSize(15);
  doc.text('Summary', 105, 44, { align: 'center' });
  doc.setLineWidth(0.5)
  doc.line(0, 47, 210, 47);

  const { text } = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: `Write a short summary for a developer resume. Use some of the users information to write a well crafter overview of the developers skills and experience. Shoot for 30 words. Something like "Full Stack Developer with over 10 years of experience in Java/JS, Angular, Vue, React, Python, NumPy, SciPy, Scikit-learn. Led development of a $500K research project which was deemed a “gold standard” by the client. Increased clients revenue 2-fold after fine-tuning AI/ML-based algorithms. Well-acquainted with HR methodologies.""
    Here is the users information:
    Primary Skills: ${user.skills.filter(skill => skill.primary).sort(sortSkills).map(skill => skill.skill.name).join(', ')}
    Secondary Skills: ${user.skills.filter(skill => !skill.primary).sort(sortSkills).map(skill => skill.skill.name).join(', ')}
    Experience: ${user.experiences.map(experience => `${experience.startDate?.toDateString()}-${experience.isCurrent ? 'Current' : experience.endDate?.toDateString()} at ${experience.company} ${experience.role} ${experience.description}`).join(` --- `)},
    Projects: ${user.projects.map(project => `${project.name} (${project.status}) - ${project.description}`).join(' --- ')}`,
  })
  doc.setFont('helvetica', 'normal')
  doc.setTextColor('#485257')
  doc.setFontSize(12);
  doc.text(text, 0, 52, { maxWidth: 210, align: 'left' });


  // Get the PDF as a Blob
  const pdfBlob = doc.output('blob');

  // Convert the Blob to an ArrayBuffer
  const arrayBuffer = await pdfBlob.arrayBuffer();

  // Convert the ArrayBuffer to a Buffer (Node.js)
  const buffer = Buffer.from(arrayBuffer);

  // Return the PDF as a response with appropriate headers
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${user.name?.replace(' ', '_')}_resume.pdf"`,
    },
  });
}
