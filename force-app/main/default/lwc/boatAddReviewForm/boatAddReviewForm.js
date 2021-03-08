import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    boatId;

    @api
    get recordId(){
        return this.boatId;
    }
    set recordId(value){
        this.setAttribute('boatId',value);
        this.boatId = value;
    }

    handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        let fields = event.detail.fields;
        fields.Boat__c = this.recordId;
        fields.Rating__c = this.template.querySelector('c-five-star-rating').value;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSuccess(event){
        const updatedRecord = event.detail.id;
        this.dispatchEvent(
            new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: 'Record Created',
                variant: SUCCESS_VARIANT
            })
        );
        /*this.dispatchEvent(
            new CustomEvent('createreview',{
                detail : {}
            })
        );*/
        this.handleReset();
     }

     handleReset(){

     }
}