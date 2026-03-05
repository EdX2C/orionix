import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { mockUsers } from '../src/data/users';
import { mockCourses } from '../src/data/courses';
import { mockModules, mockMaterials, mockAnnouncements } from '../src/data/modules';
import { mockEnrollments } from '../src/data/enrollments';
import { mockAssignments, mockSubmissions } from '../src/data/assignments';

const adapter = new PrismaBetterSqlite3({
          url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
          console.log('Clearing existing data...');
          // Delete in reverse order of dependencies
          await prisma.submission.deleteMany();
          await prisma.assignment.deleteMany();
          await prisma.enrollment.deleteMany();
          await prisma.announcement.deleteMany();
          await prisma.material.deleteMany();
          await prisma.unit.deleteMany();
          await prisma.module.deleteMany();
          await prisma.course.deleteMany();
          await prisma.user.deleteMany();

          console.log('Seeding users...');
          for (const user of mockUsers) {
                    await prisma.user.create({
                              data: {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role,
                                        avatar: user.avatar,
                                        bio: user.bio,
                                        createdAt: new Date(user.createdAt),
                                        isApproved: user.isApproved ?? true,
                                        isActive: user.isActive ?? true,
                              },
                    });
          }

          console.log('Seeding courses...');
          for (const course of mockCourses) {
                    await prisma.course.create({
                              data: {
                                        id: course.id,
                                        title: course.title,
                                        description: course.description,
                                        shortDescription: course.shortDescription,
                                        thumbnail: course.thumbnail,
                                        teacherId: course.teacherId,
                                        teacherName: course.teacherName,
                                        category: course.category,
                                        tags: course.tags?.join(','),
                                        learningOutcomes: course.learningOutcomes?.join(','),
                                        capacity: course.capacity,
                                        enrolled: course.enrolled,
                                        status: course.status,
                                        rating: course.rating,
                                        level: course.level,
                                        startDate: course.startDate ? new Date(course.startDate) : null,
                                        endDate: course.endDate ? new Date(course.endDate) : null,
                                        createdAt: new Date(course.createdAt),
                              },
                    });
          }

          console.log('Seeding modules and units...');
          for (const courseModule of mockModules) {
                    await prisma.module.create({
                              data: {
                                        id: courseModule.id,
                                        courseId: courseModule.courseId,
                                        title: courseModule.title,
                                        description: courseModule.description,
                                        order: courseModule.order,
                                        units: {
                                                  create: courseModule.units.map((unit) => ({
                                                            id: unit.id,
                                                            title: unit.title,
                                                            type: unit.type,
                                                            duration: unit.duration ?? '',
                                                            isCompleted: unit.isCompleted ?? false,
                                                  })),
                                        },
                              },
                    });
          }

          console.log('Seeding materials...');
          for (const material of mockMaterials) {
                    await prisma.material.create({
                              data: {
                                        id: material.id,
                                        courseId: material.courseId,
                                        moduleId: material.moduleId,
                                        title: material.title,
                                        type: material.type,
                                        url: material.url,
                                        size: material.size,
                                        uploadedAt: new Date(material.uploadedAt),
                              },
                    });
          }

          console.log('Seeding announcements...');
          for (const announcement of mockAnnouncements) {
                    await prisma.announcement.create({
                              data: {
                                        id: announcement.id,
                                        courseId: announcement.courseId,
                                        title: announcement.title,
                                        content: announcement.content,
                                        authorName: announcement.authorName,
                                        createdAt: new Date(announcement.createdAt),
                              },
                    });
          }

          console.log('Seeding enrollments...');
          for (const enrollment of mockEnrollments) {
                    await prisma.enrollment.create({
                              data: {
                                        id: enrollment.id,
                                        studentId: enrollment.studentId,
                                        courseId: enrollment.courseId,
                                        enrolledAt: new Date(enrollment.enrolledAt),
                                        status: enrollment.status,
                              },
                    });
          }

          console.log('Seeding assignments and submissions...');
          for (const assignment of mockAssignments) {
                    await prisma.assignment.create({
                              data: {
                                        id: assignment.id,
                                        courseId: assignment.courseId,
                                        title: assignment.title,
                                        description: assignment.description,
                                        deadline: new Date(assignment.deadline),
                                        maxScore: assignment.maxScore,
                                        status: assignment.status,
                                        createdAt: assignment.createdAt ? new Date(assignment.createdAt) : new Date(),
                              },
                    });
          }

          for (const submission of mockSubmissions) {
                    await prisma.submission.create({
                              data: {
                                        id: submission.id,
                                        assignmentId: submission.assignmentId,
                                        studentId: submission.studentId,
                                        studentName: submission.studentName,
                                        submittedAt: submission.submittedAt ? new Date(submission.submittedAt) : null,
                                        fileName: submission.fileName,
                                        comment: submission.comment,
                                        status: submission.status,
                                        score: submission.score,
                                        feedback: submission.feedback,
                              },
                    });
          }

          console.log('Seeding finished.');
}

main()
          .then(async () => {
                    await prisma.$disconnect();
          })
          .catch(async (e) => {
                    console.error(e);
                    await prisma.$disconnect();
                    process.exit(1);
          });
