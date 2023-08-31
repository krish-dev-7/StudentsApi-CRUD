
use("students")

db.students.aggregate(
    [
        {
            $group: {
              _id: '$year',
              names : {
                $push : '$name'
              }
            }
        }
    ]
);

