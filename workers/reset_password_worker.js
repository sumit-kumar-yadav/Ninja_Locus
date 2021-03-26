const queue = require('../config/kue');

const resetPasswordMailer = require('../mailers/reset_password_mailer');

// Process the work assigned to worker named (-->> recover)
queue.process('recover', function(job, done){
    console.log('Recover worker is processing a job', job.data);

    resetPasswordMailer.newPassword(job.data);
    done();
});