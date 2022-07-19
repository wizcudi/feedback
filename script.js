MAX_CHARS = 150;

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form')
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEL = document.querySelector('.spinner');

const inputHandler = () => {
    // determine maximum number of characters
    const maxNrChars = MAX_CHARS;

    // determine number of characters currently typed
    const nrCharsTyped = textareaEl.value.length;

    //calculate num of chars left (max - current typed)
    const charsLeft = maxNrChars - nrCharsTyped;

    //show # of chars left
    counterEl.textContent = charsLeft;


}

textareaEl.addEventListener('input', inputHandler)


// -- FORM COMPONENT --
const showVisualIndicator = textCheck => {
    const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';

    // show valid indicator
    formEl.classList.add(className);

    // remove visual indicator
    setTimeout(() => {
        formEl.classList.remove(className);
    }, 2000);
};


const submitHandler = event => {
    // prevent default browser action (submitting form data to 'action'-address and refreshing page)
    event.preventDefault();

    // get text from textarea
    const text = textareaEl.value;
    
    // validate text (e.g. check if #hashtag is present and text is long enough)
    if (text.includes('#') && text.length >= 5) {
        showVisualIndicator('valid');
    } else {
        showVisualIndicator('invalid');

        // focus textarea
        textareaEl.focus();

        // stop this function execution
        return;
    }

    // we have text, now extract other info from text
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    // new feedback item HTML
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
        </li>
    `;


    // insert new feedback item in list
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);

    // clear textarea
    textareaEl.value = '';

    // blur submit button
    submitBtnEl.blur();

    // reset counter
    counterEl.textContent = MAX_CHARS;

};  

formEl.addEventListener('submit', submitHandler,);//the typical way to name events is with the event in the title and add 'Handler'


// --FEEDBACK LIST COMPONENT--

fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks')
    .then(response => response.json())
    .then(data => {
        //remove spinner
        spinnerEL.remove();


        // iterate over each element in feedbacks array and render it in list
        data.feedbacks.forEach(feedbackItem => {
            // new feedback item HTML
            const feedbackItemHTML = `
                <li class="feedback">
                    <button class="upvote">
                        <i class="fa-solid fa-caret-up upvote__icon"></i>
                        <span class="upvote__count">${feedbackItem.upvoteCount}</span>
                    </button>
                    <section class="feedback__badge">
                        <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
                    </section>
                    <div class="feedback__content">
                        <p class="feedback__company">${feedbackItem.company}</p>
                        <p class="feedback__text">${feedbackItem.text}</p>
                    </div>
                    <p class="feedback__date">${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
                </li>
            `;

            // insert new feedback item in list
            feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
        });
    })
    .catch(error => {
        feedbackListEl.textContent = `Failed to fectch Items. Error message ${error.message}`
    })












