import { LightningElement, wire } from 'lwc';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import labelDetails from '@salesforce/label/c.Details';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import { getRecord,getFieldValue  } from 'lightning/uiRecordApi';
import IdField from '@salesforce/schema/Boat__c.Id';
import NameField from '@salesforce/schema/Boat__c.Name';
import { subscribe, APPLICATION_SCOPE, MessageContext} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { NavigationMixin } from 'lightning/navigation';

const BOAT_FIELDS = [NameField, IdField];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {

    @wire (getRecord, {recordId : '$boatId', fields : BOAT_FIELDS}) 
    wiredRecord;
    subscription = null;

    boatId;
    label = {labelPleaseSelectABoat , labelDetails, labelFullDetails, labelReviews, labelAddReview};

    @wire(MessageContext)
        messageContext;

    get boatName(){
        return getFieldValue(this.wiredRecord.data , NameField);
    }

    get detailsTabIconName(){
        return this.wiredRecord.data ? 'utility:anchor' : null;
    }

    connectedCallback(){
        if(this.subscription || this.boatId)
            return;
        this.subscribeMC();
    }

    subscribeMC(){
        this.subscription = subscribe(this.messageContext , BOATMC , (message)=>{ this.boatId = message.recordId }, {scope: APPLICATION_SCOPE});
    }

    navigateToRecordViewPage(event){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boatId,
                actionName: 'view'
            },
        });
    }

    handleReviewCreated(event){
        this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
    }
}