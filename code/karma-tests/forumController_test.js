describe('forummanagementController', function() {
	
    var sfactoryMock,q,deferred,$scope,controller;

	var forum ={},data;
	forum.addNewTopic={"data":{
		"topicId": "12",
		"topicTitle": "Welcome123",
		"topicMessage": "You are welcome",
		"topicAttachment": "1496730687___dummy.jpg",
		"topicCategory": "General",
		"topicAssignedTo": "Student",
		"topicCreatedBy": "Admin121 294",
		"topicCreatedOn": "2017-06-06 06:31:27",
		"lastUpdatedOn": "0000-00-00 00:00:00",
		"topicPublishStatus": "0",
		"topicDeleteStatus": "0",
		"countDiscussion": "0"
		}
	};
	forum.forumTopicList ={
		"data": [{
			"topicId": "8",
			"topicTitle": "Welcome New Topic",
			"topicMessage": "Welcome new forum",
			"topicAttachment": "1496730687___dummy.jpg",
			"topicCategory": "General",
			"topicAssignedTo": "Student",
			"topicCreatedBy": "Admin121 294",
			"topicCreatedOn": "2017-06-06 06:31:27",
			"lastUpdatedOn": "0000-00-00 00:00:00",
			"topicPublishStatus": "0",
			"topicDeleteStatus": "0",
			"countDiscussion": "0"
		}],
		
		"postCategory": [{
			"id": "1",
			"name": "General",
			"postedTo": [{
				"postToId": "5",
				"postName": "Student"
			}, {
				"postToId": "3",
				"postName": "Teacher"
			}, {
				"postToId": "9",
				"postName": "Parent"
			}]
		}, {
			"id": "2",
			"name": "Class",
			"postedTo": [{
				"postToId": "3",
				"postName": "Test Class"
			}, {
				"postToId": "4",
				"postName": "Test Class1"
			}]
		}],
		"discussionDetails": [{
			"discussionId": "5",
			"discussionTopicId": "5",
			"discussionMessage": "Forum works too good",
			"discussionCreatedOn": "2017-06-06 06:54:09",
			"discussionApproveStatus": "1",
			"discussionDeleteStatus": "0",
			"discussUserId": "294",
			"discussUserFirstname": "Admin121",
			"discussUserLastname": "Last",
			"discussUserRoletype": "0"
		}]
	}
    beforeEach(function() {
        module('advancePublications');
        module(function($provide) {
            $provide.factory('sfactory', function($q) {
                return {
                    serviceCall: function (dataRequest,serviceName,serviceType) {
						if(serviceType === 'forum.forumTopicList'){
							data = forum.forumTopicList;
						}
						deferred = $q.defer();
						deferred.resolve(data);
						return deferred.promise;
					},
					serviceCallFormData : function (dataRequest,serviceName,serviceType) {
						data = forum.addNewTopic;
						deferred = $q.defer();
						deferred.resolve(data);
						return deferred.promise;
					}
                };
            });
        });
    });

    beforeEach(inject(function($rootScope, $controller, sfactory) {
        $scope = $rootScope.$new();
        sfactoryMock = sfactory;
        controller = $controller('forummanagementController', {
            $scope: $scope,
            sfactory: sfactoryMock
        });
		$rootScope.$digest();
    }));
	
	it('$scope should be defined', function() {
		expect($scope).toBeDefined();
	});
	
	it("Should test add new forum form is disappeared when click on index button", function() {
		$scope.forum={addNewTopic:true};
		$scope.cancelNewTopic();
		expect($scope.forum.addNewTopic).toBe(false);
    });

	it("Should test forum list is displayed", function() {
		$scope.changeFormDisplay(true,false);
		expect($scope.forum.formList).toBe(true);
		expect($scope.forum.expanded).toBe(false);
    });

	it("Should test expanded view of forum is displayed", function() {
		$scope.changeFormDisplay(true,true);
		expect($scope.forum.formList).toBe(true);
		expect($scope.forum.expanded).toBe(true);
    });
	
	it("Should test newforum is added", function() {
		$scope.forum = {addNewTopic :true};
		$scope.forumData ={filteredForums:[{
			"topicId": "8",
			"topicTitle": "Welcome2",
			"topicMessage": "Welcome new forum2",
			"topicAttachment": "1496730687___dummy.jpg2",
			"topicCategory": "General2",
			"topicAssignedTo": "Teacher2",
			"topicCreatedBy": "Admin121 2942",
			"topicCreatedOn": "2017-06-06 06:31:272",
			"lastUpdatedOn": "0000-00-00 00:00:002",
			"topicPublishStatus": "02",
			"topicDeleteStatus": "02",
			"countDiscussion": "02"
		}]};
		expect($scope.forumData.filteredForums.length).toBe(1);
		$scope.addNewForum();
		$scope.$digest();
		expect($scope.forumData.filteredForums.length).toBe(2);
		expect($scope.forum.addNewTopic).toBe(false);
    });
});