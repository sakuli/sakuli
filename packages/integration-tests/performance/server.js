const fastify = require('fastify')();

fastify.get('/:count', async (req, reply) => {
    const count = req.params.count || 10;
    reply.header('Content-Type', 'text/html; charset=utf-8');
    return `
        <html>
            <body>
                ${Array.from({length: count}, (_, i) => i).map(i => `
                    <div id="div-${i}">${i}</div>
                `).join('\n')}
            </body>
        </html>
    `
})

const main = async () => {
    try {
        await fastify.listen(3000)
    } catch(err) {
        fastify.log.error(err);
        process.exit();
    }
};

main();
