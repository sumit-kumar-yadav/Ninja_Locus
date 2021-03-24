const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

// Process the work assigned to worker named (-->> emails)
queue.process('emails', function(job, done){
    console.log('Email worker is processing a job', job.data);

    commentsMailer.newComment(job.data);
    done();
});