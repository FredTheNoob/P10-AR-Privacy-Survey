import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const result = await prisma.$queryRaw`
  SELECT
    sq."censoringMethod",
    COUNT(DISTINCT r."userId") AS "userCount"
  FROM "Response" r
  JOIN "SurveyQuestion" sq
    ON r."questionId" = sq."id"
  WHERE sq."isScenario" = true
  GROUP BY sq."censoringMethod"
  ORDER BY sq."censoringMethod";
`;

const invalidUsers = await prisma.$queryRaw`
  SELECT
    r."userId",
    COUNT(DISTINCT sq."censoringMethod") AS method_count
  FROM "Response" r
  JOIN "SurveyQuestion" sq
    ON r."questionId" = sq."id"
  WHERE
    sq."isScenario" = true
    AND sq."censoringMethod" IS NOT NULL
    AND sq."censoringMethod" != 'NONE'
  GROUP BY r."userId"
  HAVING COUNT(DISTINCT sq."censoringMethod") > 1;
`;

console.log(result)
console.log(invalidUsers)