advancePubapp.service('taskService', function() {

    var map = {
        contentmanagementController : {
            getContents: 'content_v2.contentsList',
            activityAssign: 'content_v2.scormGroupAssign',
            courseAssign: 'content_v2.catGroupAssign',
            lessonAssign: 'content_v2.lessonGroupAssign',
            sectionAssign: 'content_v2.sectionGroupAssign',
            assignSurvey:'survey.assign_survey',
            getBookList:'media_library_products',
            getMediaLibraryMenuContent : 'medialibrary.mediaContentMenu',
            getMediaLibraryContent : 'medialibrary.mediaContentDetails',
            getMediaLibraryActions : 'medialibrary.mediaContentActions'
        },
        classmanagementTask : {
            getClasses: 'adminclass.classList',
            checkClassExistance: 'adminclass.classnameexist',
            classadminlist: 'adminclass.classadminlist',
            getUserlist: 'adminclass.fetchStudentList',
            getExistingstudentslist:'adminclass.fetchStudentList',
            getExistingstudentslistClass:'adminclass.fetchStudentList',
            addExistingstudentstoclass:'adminclass.addStudenttoclass',
            getExistingstudnetslistGroup:'adminclass.fetchClassStudentList',
            addExistingstudentstogroup:'adminclass.addStudenttoGroup',
            getExistingstudentslistExistingClass:'adminclass.getExpectclassstudent',
            getExistingstudnetslistClass:'adminclass.getExpectgroupstudent',
        },
        classDetailsController : {
            getClassDetails: 'adminclass.getClassgroupdetails',
            getGroupDetails: 'adminclass.getGroupstudentdetails',
            getContents: 'adminclass.classAssignContentList',
            deleteClass: 'adminclass.deleteClass',
            deleteGroup: 'adminclass.deleteClassGroup',
            getHeader:'adminclass.contentheader'
        },
        createClassController : {
            addNewClass: 'adminclass.addClass',
            editClass: 'adminclass.editClass',
            teacherlist :'adminclass.editclassadminlist'
        },
        addStudentModalController : { 
            validateUsername :"adminclass.userNameExistCheck",
            validateEmail:"adminclass.emailExistCheck",
            addnewstudent:"adminclass.addnewstudent",
            multipleuserImport:"adminclass.userImport"
        },
        phonicsClassController : {
            getClasses: 'adminclass.getDashboardDetails',
            getUserlist: 'adminclass.fetchStudentList',
            getExistingstudentslist:'adminclass.fetchStudentList',
            getExistingstudentslistClass:'adminclass.fetchStudentList',
            addExistingstudentstoclass:'adminclass.addStudenttoclass',
            getExistingstudnetslistGroup:'adminclass.fetchClassStudentList',
            addExistingstudentstogroup:'adminclass.addStudenttoGroup',
            getExistingstudentslistExistingClass:'adminclass.getExpectclassstudent',
            getExistingstudnetslistClass:'adminclass.getExpectgroupstudent',
        },
        createGroupController : {
            addNewGroup: 'adminclass.addGroupintoclass',
            editGroup: 'adminclass.editClassGroup',
            checkGroupExistance: 'adminclass.groupnameexist',
            createNewOrg:'organization.add',
            checkOrgExistance  :'organization.orgexistcheck'
        },
        editStudentController : { 
            editStudent: 'adminclass.userEdit',
            removeGroupStudent: 'adminclass.removeUserinGroup',
            removeClassStudent: 'adminclass.removeUserinClass',
            validateEmail:"adminclass.emailExistCheck"
        },
        classcontentmanagementController : { 
            getContents: 'content_v2.contentsList',
            activityAssign: 'content_v2.scormGroupAssign',
            courseAssign: 'content_v2.catGroupAssign',
            lessonAssign: 'content_v2.lessonGroupAssign',
            sectionAssign: 'content_v2.sectionGroupAssign',
            getContents: 'adminclass.classAssignContentList',
            assignCourse: 'adminclass.assignContenttoclass',
            assignCourseIndividual:'adminclass.individualCourseAssign'
        },
        studentprofileController : { 
            studentIndividualAssignment:'adminclass.getStudentIndividualAssignements',
            studentClassAssignment:'adminclass.getStudentClassAssignements',
            studentGroupAssignment: 'adminclass.getStudentGroupAssignements'
        },
        surveyController : {
            getSurveyList:'survey.survey_list',
            createSurvey:'survey.add_survey',
            getSurvey:'survey.getsurvey',
            enableSurvey:'survey.enable_survey',
            editSurvey:'survey.edit_survey',
            deleteSurvey:'survey.delete_survey'
        },
        surveyresultsController :{
            getSurveyResult:'survey.getSurveyResult',
        },
        usermanagementController:{
            getAllUsers : "user.get_newalluser_details",
            getAllTrashUsers : "user.get_alldeleteduser_details",
            createUser:"user.userRegister",
            validateEmail:"user.emailExistCheck",
            validateUserName:"user.userNameExistCheck"
        },
        accordionController :{
            validateEmail:"user.emailExistCheck"
        },
        myProfileController :{
            validateEmail:"user.emailExistCheck"
        },
        groupmanagentController:{
            checkwithExistusername:"groups.userNameExistCheck",
            checkwithExistemail:"groups.emailExistCheck"
        }
    }

    this.getTasks = function(key) {
        return map[key];
    }; 

});