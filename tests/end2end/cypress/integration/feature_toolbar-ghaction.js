const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


describe('Feature Toolbar', function () {

    beforeEach(function () {
        // Runs before each tests in the block
        cy.visit('/index.php/view/map/?repository=testsrepository&project=feature_toolbar&lang=en_en')

        cy.wait(300)

        // Click one feature on the map
        cy.get('#map').click(625, 362)
    })

    it('should display working tools', function () {
        const PNG = require('pngjs').PNG;
        const pixelmatch = require('pixelmatch');

        // Open parent_layer in attribute table
        cy.get('#button-attributeLayers').click()
        cy.get('button[value="parent_layer"].btn-open-attribute-layer').click({ force: true })

        cy.intercept('*REQUEST=GetMap*',
            { middleware: true },
            (req) => {
                req.on('before:response', (res) => {
                    // force all API responses to not be cached
                    // It is needed when launching tests multiple time in headed mode
                    res.headers['cache-control'] = 'no-store'
                })
            }).as('getMap')

        // 1/ Selection
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-select').click()

        cy.wait('@getMap')

        // Test feature is selected on map
        cy.get('@getMap').should(({ request, response }) => {
            const responseBodyAsBase64 = arrayBufferToBase64(response.body)

            cy.fixture('images/feature_toolbar/selection.png').then((image) => {
                // image encoded as base64
                const img1 = PNG.sync.read(Buffer.from(responseBodyAsBase64, 'base64'));
                const img2 = PNG.sync.read(Buffer.from(image, 'base64'));
                const { width, height } = img1;

                expect(pixelmatch(img1.data, img2.data, null, width, height, { threshold: 0 }), 'expect point to be displayed in yellow').to.equal(0)
            })
        })

        // Test feature is selected on popup
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-select').should('have.class', 'btn-primary')

        // Test feature is selected on attribute table
        cy.get('#attribute-layer-table-parent_layer tbody tr:first').should('have.class', 'selected')
        cy.get('#attribute-layer-table-parent_layer lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-select').should('have.class', 'btn-primary')

        // 2/ Filter
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-filter').click()

        cy.wait('@getMap')

        // Test feature is filtered on map
        cy.get('@getMap').should(({ request, response }) => {
            const responseBodyAsBase64 = arrayBufferToBase64(response.body)

            cy.fixture('images/feature_toolbar/filter.png').then((image) => {
                // image encoded as base64
                const img1 = PNG.sync.read(Buffer.from(responseBodyAsBase64, 'base64'));
                const img2 = PNG.sync.read(Buffer.from(image, 'base64'));
                const { width, height } = img1;

                expect(pixelmatch(img1.data, img2.data, null, width, height, { threshold: 0 }), 'expect only one filtered point').to.equal(0)
            })
        })

        // Test feature is filtered on popup
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-filter').should('have.class', 'btn-primary')

        // Test feature is filtered on attribute table
        cy.get('#attribute-layer-main-parent_layer .btn-filter-attributeTable').should('have.class', 'btn-primary')

        // Disable filter
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-filter').click()

        // Test feature is not filtered on popup
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-filter').should('not.have.class', 'btn-primary')

        // Test feature is not filtered on attribute table
        cy.get('#attribute-layer-main-parent_layer .btn-filter-attributeTable').should('not.have.class', 'btn-primary')

        // 3/ Unlink children feature
        cy.get('#bottom-dock-window-buttons .btn-bottomdock-size').click()

        cy.get('#attribute-layer-table-parent_layer-children_layer tbody tr').should('have.length', 0)

        cy.get('#attribute-layer-table-parent_layer tbody tr:first').click({force: true})

        cy.get('#attribute-layer-table-parent_layer-children_layer tbody tr').should('have.length', 1)

        // Click unlink button
        cy.get('#attribute-layer-table-parent_layer-children_layer tbody tr .feature-unlink').click({ force: true })

        // Confirmation message should be displayed
        cy.get('#message .jelix-msg-item-success').should('have.text', 'The child feature has correctly been unlinked.')

        // 4/ Link back children feature
        // Select parent feature
        cy.get('#attribute-layer-table-parent_layer lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-select').click({ force: true })

        // Select children feature
        cy.get('#nav-tab-attribute-summary').click()
        cy.get('button[value="children_layer"].btn-open-attribute-layer').click({ force: true })
        cy.get('#attribute-layer-table-children_layer lizmap-feature-toolbar[value="children_layer_358cb5a3_0c83_4a6c_8f2f_950e7459d9d0.1"] .feature-select').click({ force: true })

        // Link parent and children
        cy.get('#nav-tab-attribute-layer-parent_layer').click({ force: true })
        cy.get('.btn-linkFeatures-attributeTable').click({ force: true })

        // Confirmation message should be displayed
        cy.get('#message .jelix-msg-item-success').should('have.text', 'Selected features have been correctly linked.')
    })

    it('should display working custom action', function () {
        cy.get('.popupButtonBar .popup-action').click()

        // Test feature is selected on popup
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-select').should('have.class', 'btn-primary')

        cy.on('window:confirm', () => true);

        // Confirmation message should be displayed
        cy.get('#message #lizmap-action-message p').should('have.text', 'The buffer 500m has been displayed in the map')

        // End action
        cy.get('.popupButtonBar .popup-action').click()
        cy.get('#message').should('be.empty')
    })
    
    it('should start child edition linked to a parent feature', function () {
        // Start parent edition
        cy.get('#popupcontent lizmap-feature-toolbar[value="parent_layer_d3dc849b_9622_4ad0_8401_ef7d75950111.1"] .feature-edit').click()
        
        // Start child edition
        cy.get('#edition-children-container lizmap-feature-toolbar[value="children_layer_358cb5a3_0c83_4a6c_8f2f_950e7459d9d0.1"] .feature-edit').click()

        cy.get('#lizmap-edition-message').should('be.visible')

        // Parent_id is disabled in form when edition is started from parent form
        cy.get('#jforms_view_edition_parent_id').should('be.disabled')
    })
})