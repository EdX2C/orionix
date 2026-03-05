import re

path = r'd:\Descargas\Orion\orionix\src\services\index.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Course status/level casts in getById and list
content = re.sub(
    r'status:\s+course\.status\s+as\s+any,',
    "status: course.status as Course['status'],",
    content
)
content = re.sub(
    r'level:\s+course\.level\s+as\s+any,',
    "level: course.level as Course['level'],",
    content
)

# Fix Assignment status casts
content = re.sub(
    r'status:\s+a\.status\s+as\s+any,',
    "status: a.status as Assignment['status'],",
    content
)
content = re.sub(
    r'status:\s+assignment\.status\s+as\s+any,',
    "status: assignment.status as Assignment['status'],",
    content
)
content = re.sub(
    r'status:\s+updated\.status\s+as\s+any,',
    "status: updated.status as AssignmentStatus,",
    content
)
content = re.sub(
    r'status:\s+s\.status\s+as\s+any,',
    "status: s.status as AssignmentStatus,",
    content
)
content = re.sub(
    r'status:\s+sub\.status\s+as\s+any,',
    "status: sub.status as AssignmentStatus,",
    content
)

# Fix (await this.getById(...)) as any
content = re.sub(
    r'return\s+this\.getById\(course\.id\)\s+as\s+any;',
    'return (await this.getById(course.id)) as Course;',
    content
)
content = re.sub(
    r'return\s+this\.getById\(id\)\s+as\s+any;',
    'return (await this.getById(id)) as Course;',
    content
)

# Fix specific Submission mapping at line 264ish
# sub is Prisma Submission, we return a mapped one.
# Ensure all fields from Submission interface are present if needed, or cast correctly.
# The error was: Type '{ status: AssignmentStatus; submittedAt: string; ... }' is not assignable to type 'Submission'.
# Probably because of id, studentId, etc. being there but tsc being picky about 'sub' properties.

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete")
