const logger = require('../util/logger');
const memberService = require('../services/member.service');

const memberContoller = {
    getMember: (req, res, next) => {
        logger.trace('memberController -> getMember');

        memberService.getMember(req.userId, (error, succes) => {
            if (error) {
                logger.error('memberController -> getMember');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message || 'Hoi',
                    data: succes.data || 'Hoi'
                })
            }
        });

    }
}

module.exports = memberContoller;