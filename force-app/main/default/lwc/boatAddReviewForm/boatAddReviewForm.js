import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    boatId;
    rating = 0;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating = 'Rating';
    @api
    get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }
    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }
    handleSubmit(event) {
        event.preventDefault();
        let fields = event.detail.fields;
        fields.Boat__c = this.boatId;
        fields.Rating__c = this.rating;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSuccess(event) {
        const reviewId = event.detail.id;
        this.dispatchEvent(
            new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: 'Record Created',
                variant: SUCCESS_VARIANT
            })
        );
        this.dispatchEvent(
            new CustomEvent('createreview', {
                detail: reviewId
            })
        );
        this.handleReset();
    }

    handleReset() {
        this.rating = 0;
        let inputFields = this.template.querySelectorAll('lightning-input-field')
        
        if(inputFields){
            inputFields.forEach(input => {
                input.reset();
            });
        }
    }
}