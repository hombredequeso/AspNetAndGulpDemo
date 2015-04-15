describe('MyPageViewModel Tests', function () {
    it("ViewModel exists", function () {
        var viewModel = myApp.myDomain.myPageViewModel();
        expect(viewModel).toBeDefined();
    });

    it("description is correctly defined", function () {
        var viewModel = myApp.myDomain.myPageViewModel();
        expect(viewModel.description).toBe("DescriptionSetByViewModelY");
    });
});