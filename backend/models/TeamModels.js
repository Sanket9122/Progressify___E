const mongoose = require('mongoose');
const teamSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        description:{
            type:String,
            required:false,
        },
        teamMembers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'TeamMember',
            }
        ],
        projects:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Project',
            }
        ]
    },
    {
        timestamps:true,
    }
);
const Team = mongoose.model('Team',teamSchema);
module.exports = Team;