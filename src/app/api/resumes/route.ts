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

  const margin = 17
  const padding = 14
  const sectionGap = 14
  const highlight = '#329AFF'
  const text = '#485257'
  const titleColor = '#000000'

  let y = margin

  doc.setLineWidth(0.3)
  doc.setLineHeightFactor(1.6)

  const setDefaultText = () => {
    doc
      .setFont('helvetica', 'normal')
      .setTextColor('#485257')
      .setFontSize(8)
    return doc
  }

  const drawLine = (color: string | undefined = '#ff0000') => {
    doc.setDrawColor(color)
    doc.line(padding, y, 210 - padding, y)
  }

  const addTitle = (title: string) => {
    y += doc.getTextDimensions(title, { fontSize: 13 }).h
    doc
      .setFont('times', 'normal')
      .setTextColor(titleColor)
      .setFontSize(13)
      .text(title, 105, y, { align: 'center' })

    y += 2
    doc.line(padding, y, 210 - padding, y)

    y += 2

    return doc
  }

  // add name to top
  doc
    .setFont('times', 'bold')
    .setFontSize(15)
    .text(user.name?.toUpperCase() ?? 'Name not available', 105, y, { align: 'center' });
  // y += doc.getTextDimensions(user.name?.toUpperCase() ?? 'Name not available', { fontSize: 15 }).h
  y += 2
  y += doc.getTextDimensions(user.headline ?? 'Headline not available', { fontSize: 11 }).h
  // add headline
  doc
    .setFont('helvetica', 'normal')
    .setFontSize(11)
    .setTextColor(highlight)
    .text(user.headline ?? 'Headline not available', 105, y, { align: 'center' });

  y += 1
  const about = [user.email, user.website, `github.com/${user.username}`, user.location ?? user.region].filter(Boolean).join(' • ')
  y += doc.getTextDimensions(about, { fontSize: 8 }).h

  setDefaultText()
    .text(about, 105, y, { align: 'center'});

  y += 6

  addTitle('Summary')

  const descriptionGen = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: `Write a short summary for a developer resume. Use some of the users information to write a well crafter overview of the developers skills and experience. Shoot for 30 words. Something like "Full Stack Developer with over 10 years of experience in Java/JS, Angular, Vue, React, Python, NumPy, SciPy, Scikit-learn. Led development of a $500K research project which was deemed a “gold standard” by the client. Increased clients revenue 2-fold after fine-tuning AI/ML-based algorithms. Well-acquainted with HR methodologies.""
    Here is the users information:
    Primary Skills: ${user.skills.filter(skill => skill.primary).sort(sortSkills).map(skill => skill.skill.name).join(', ')}
    Secondary Skills: ${user.skills.filter(skill => !skill.primary).sort(sortSkills).map(skill => skill.skill.name).join(', ')}
    Experience: ${user.experiences.map(experience => `${experience.startDate?.toDateString()}-${experience.isCurrent ? 'Current' : experience.endDate?.toDateString()} at ${experience.company} ${experience.role} ${experience.description}`).join(` --- `)},
    Projects: ${user.projects.map(project => `${project.name} (${project.status}) - ${project.description}`).join(' --- ')}`,
  })
  
  y += doc.getTextDimensions('test', { maxWidth: 210 - (padding * 2), fontSize: 8 }).h

  setDefaultText()
  .text(descriptionGen.text, padding, y, { maxWidth: 210 - (padding * 2), align: 'left' });
  y += doc.getTextDimensions(descriptionGen.text, { maxWidth: 210 - (padding * 2), fontSize: 8 }).h
  
  y += sectionGap
  addTitle('Experience')
  for (const experience of user.experiences) {
    y += doc.getTextDimensions(experience.company ?? '', { fontSize: 11 }).h
    doc
      .setFont('helvetica', 'normal')
      .setFontSize(11)
      .setTextColor(highlight)
      .text(experience.company ?? '', padding, y, {})
      y += 1
      y += doc.getTextDimensions(experience.role ?? '', { fontSize: 10 }).h

    doc
      .setFont('helvetica', 'normal')
      .setFontSize(10)
      .setTextColor(titleColor)
      .text(experience.role ?? '', padding, y, {})
    doc
      .setTextColor(text)
      .text(`${experience.startDate?.getFullYear() ?? 'Unknown'} - ${experience.isCurrent ? 'Current' : experience.endDate?.getFullYear() ?? 'Unknown'}`, 210 - padding, y, { align: 'right' })

    y += 1
    y += doc.getTextDimensions('hello', { maxWidth: 210 - (padding * 2), fontSize: 8 }).h

    setDefaultText()
      .text(experience.description ?? '', padding, y, { maxWidth: 210 - (padding * 2) })
    y += doc.getTextDimensions(experience.description ?? '', { maxWidth: 210 - (padding * 2), fontSize: 8 }).h
  }

  y += sectionGap

  addTitle('Skills')

  y += doc.getTextDimensions('Primary Skills:', { fontSize: 8 }).h
  doc
    .setFont('helvetica', 'normal')
    .setFontSize(8)
    .setTextColor(highlight)
    .text('Primary Skills:', padding, y, {})
  doc
    .setTextColor(text)
    .text(user.skills.filter(skill => skill.primary).sort(sortSkills).map(skill => skill.skill.name).join(', '), padding + 25, y, { maxWidth: 210 - (padding * 2) })

  y += 1
  y += doc.getTextDimensions('Secondary Skills:', { fontSize: 8 }).h
  doc
    .setTextColor(highlight)
    .text('Secondary Skills:', padding, y, {})
  doc
    .setTextColor(text)
    .text(user.skills.filter(skill => !skill.primary).sort(sortSkills).map(skill => skill.skill.name).join(', '), padding + 25, y, { maxWidth: 210 - (padding * 2) })
  
  y += sectionGap

  addTitle('Projects')

  for (const project of user.projects) {
    y += doc.getTextDimensions(project.name ?? '', { fontSize: 11 }).h
    doc
      .setFont('helvetica', 'normal')
      .setFontSize(11)
      .setTextColor(highlight)
      .text(project.name ?? '', padding, y, {})
      y += 1
      y += doc.getTextDimensions(project.name ?? '', { fontSize: 10 }).h
    doc
      .setFont('helvetica', 'normal')
      .setFontSize(10)
      .setTextColor(titleColor)
      .text(project.url ?? '', padding, y, {})
    doc
      .setTextColor(text)
      .text(project.status ?? '', 210 - padding, y, { align: 'right' })

    y += 3
    y += doc.getTextDimensions('hello', { maxWidth: 210 - (padding * 2), fontSize: 8 }).h

    setDefaultText()
    .text(project.description ?? '', padding, y, { maxWidth: 210 - (padding * 2) })
    y += doc.getTextDimensions(project.description ?? '', { maxWidth: 210 - (padding * 2), fontSize: 8 }).h
    y += 4
  }


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
