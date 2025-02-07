document.addEventListener('DOMContentLoaded', function() {
    const triggers = [
        { name: "Search NPC", description: "Szuka NPC za pomocą modelu gdy serwer ukrywa kordy a macie jedynie nazwe modelu NPC", textToCopy: `
-- LeakM.fun
Citizen.CreateThread(function()
    local npcModelHash = GetHashKey("g_f_y_ballas_01") -- Tutaj wpierdalacie nazwe npc!
    
    local handle, ped = FindFirstPed()
    local success = true

    while success do
        if IsPedModel(ped, npcModelHash) then
            local npcCoords = GetEntityCoords(ped)
            print(string.format("LeakM.pl | Znaleziono NPC, kordy:: x: %.2f, y: %.2f, z: %.2f", npcCoords.x, npcCoords.y, npcCoords.z))
            
            EndFindPed(handle)
            return
        end

        success, ped = FindNextPed(handle)
    end

    EndFindPed(handle)
    print("LeakM.pl | Nie udało się znalezc npc.")
end)` },
        { name: "Otwieranie pojazdu", description: "Trigger na otwieranie pojazdu", textToCopy: `
-- LeakM.fun

local function UnlockNearbyVehicles()
    local playerPed = PlayerPedId()
    local playerPos = GetEntityCoords(playerPed)

    local radius = 5.0 -- tutaj mozecie zmienic promien na wiekszy

    local vehicles = GetGamePool('CVehicle')

    for _, vehicle in ipairs(vehicles) do
        local vehiclePos = GetEntityCoords(vehicle)
        local distance = #(vehiclePos - playerPos)

        if distance <= radius then
            SetVehicleDoorsLocked(vehicle, 1)
            SetVehicleDoorsLockedForAllPlayers(vehicle, false)
            print("Odblokowano pojazd", vehicle)
        end
    end
end

UnlockNearbyVehicles()
` },
        { name: "Teleport Kordy", description: "Skrypt teleportuje do kordynatów", textToCopy: `
-- LeakM.fun

local function TeleportToCoords(x, y, z)

    local playerPed = PlayerPedId()
    SetEntityCoords(playerPed, x, y, z, false, false, false, true)
    print(string.format("Teleportowano na współrzędne: X: %.2f, Y: %.2f, Z: %.2f", x, y, z))
end

local targetX, targetY, targetZ = 245.62, 370.71, 104.74, 154.71 -- tutaj wpierdalasz kordy
TeleportToCoords(targetX, targetY, targetZ)
    ` },

        { name: "GPS", description: "Skrypt zaznaczający gps na kordy które wpiszemy", textToCopy: `
-- LeakM.fun

local function SetGPS(x, y, z)
    SetNewWaypoint(x, y)
    print(string.format(GPS ustawiony na współrzędne X %.2f, Y %.2f, Z %.2f, x, y, z))
end


local targetX, targetY, targetZ = 389.4990, 799.1282, 187.6713 -- Tutaj dajesz kordy
SetGPS(targetX, targetY, targetZ)
    ` },
        { name: "Szukanie propów", description: "Trigger który szuka propów, gdy znajdzie pojawia się nad nimi tekst z nazwą propa", textToCopy: `
-- LeakM.fun
Citizen.CreateThread(function()
    -- TUTAJ DAJECIE LISTE PROPOW JAKIE MA SZUKAC
    local propsToFind = {
        "prop_michael_backpack",
        "bkr_prop_duffel_bag_01a",
        "prop_cs_heist_bag_02",
        "v_club_vu_djbag",
        "prop_cs_shopping_bag",
        "prop_nigel_bag_pickup",
        "prop_stat_pack_01",
        "hei_heist_acc_box_trinket_02",
        "prop_cs_cardbox_01"
    }

    local propHashes = {}
    for _, propName in ipairs(propsToFind) do
        table.insert(propHashes, GetHashKey(propName))
    end

    Citizen.CreateThread(function()
        while true do
            Citizen.Wait(0)

            local playerCoords = GetEntityCoords(PlayerPedId())

            local handle, object = FindFirstObject()
            local success

            repeat
                local objectModel = GetEntityModel(object)
                for _, hash in ipairs(propHashes) do
                    if objectModel == hash then
                        local propCoords = GetEntityCoords(object)
                        local distance = #(playerCoords - propCoords)


                        if distance < 100.0 then
                            DrawMarker(
                                1, 
                                propCoords.x, propCoords.y, propCoords.z + 1.0,
                                0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0,
                                0.2, 0.2, 0.2,
                                255, 0, 0, 150,
                                false,
                                true,
                                2, 
                                nil, nil, false 
                            )


                            DrawText3D(propCoords.x, propCoords.y, propCoords.z + 1.5, propsToFind[_])
                        end
                    end
                end

                success, object = FindNextObject(handle)
            until not success

            EndFindObject(handle)
        end
    end)
end)


function DrawText3D(x, y, z, text)
    local onScreen, _x, _y = World3dToScreen2d(x, y, z)
    local px, py, pz = table.unpack(GetGameplayCamCoords())

    if onScreen then
        SetTextScale(0.35, 0.35)
        SetTextFont(4)
        SetTextProportional(1)
        SetTextColour(255, 255, 255, 215)
        SetTextEntry("STRING")
        SetTextCentre(1)
        AddTextComponentString(text)
        DrawText(_x, _y)
    end
end
    ` },
            { name: "STOLICARP", description: "Trigger na wbicie 100% siłowni i 100% kondycji", textToCopy: `
-- LeakM.fun
    TriggerServerEvent('vms_gym:sv:setTaken', 1, 8, true)
    TriggerServerEvent('vms_gym:sv:addValue', "strenght", 100)
    TriggerServerEvent('vms_gym:sv:setTaken', 1, 1, true)
    TriggerServerEvent('vms_gym:sv:addValue', "condition", 100)
    ` },




 //         { name: "Name Trigger", description: "OPIS", textToCopy: `TU KOD
 //` },
    ];

    const triggerContainer = document.getElementById('trigger-container');

    triggers.forEach(trigger => {
        const triggerItem = document.createElement('div');
        triggerItem.className = 'trigger-item';

        const triggerName = document.createElement('h3');
        triggerName.textContent = trigger.name;
        triggerItem.appendChild(triggerName);

        const triggerDescription = document.createElement('p');
        triggerDescription.textContent = trigger.description;
        triggerItem.appendChild(triggerDescription);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'SKOPIUJ';
        copyButton.setAttribute('data-trigger', trigger.textToCopy);
        triggerItem.appendChild(copyButton);

        triggerContainer.appendChild(triggerItem);
    });

    const copyButtons = document.querySelectorAll('.copy-button');

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trigger = this.getAttribute('data-trigger');
            navigator.clipboard.writeText(trigger).then(() => {
                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    const susanoLink = document.createElement('a');
    susanoLink.href = 'susano-konwerter.html';
    susanoLink.textContent = 'SUSANO KONWERTER';
    susanoLink.style.color = 'white';
    susanoLink.style.marginRight = '20px';
    susanoLink.style.cursor = 'pointer';

    const header = document.querySelector('header');
    header.insertBefore(susanoLink, header.firstChild);
});
