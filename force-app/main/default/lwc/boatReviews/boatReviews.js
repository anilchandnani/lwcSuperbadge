import { api, LightningElement } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    boatId;
    boatReviews;
    isLoading = false;
    @api
    get recordId(){
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
        this.getReviews();
    }

    get reviewsToShow(){
        return this.boatReviews && this.boatReviews.length > 0;
    }
    
    getReviews(){
        this.isLoading = true;
        getAllReviews({boatId : this.boatId})
        .then(data => {
            this.boatReviews = data;
            this.isLoading = false;
        })
        .catch(error => {
            this.isLoading = false;
        })
    }

    navigateToRecord(event){
        let userId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: userId,
                actionName: 'view'
            }
        });
    }

    @api
    refresh(){
        this.getReviews();
    }
}