window.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
        var scene = new BABYLON.Scene(engine);

        engine.enableOfflineSupport = false;
        var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), 10.0, BABYLON.Vector3.Zero(), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        camera.keysLeft.push(45);
        camera.keysRight.push(45);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);


        var canvasSecond = document.getElementById("canvas2");
        canvasSecond.width = 1024;
        canvasSecond.height = 1024;


        //canvas
        var canvasSec = new fabric.Canvas('canvas2');
        fabric.Image.fromURL("textures/shirt_diffuse.png", function(img2) {
            var img3 = img2.set({ selectable: false });
            canvasSec.add(img3).renderAll();


        });

        //FileReader
        document.getElementById('file').addEventListener("change", function(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            //console.log("reader   " + reader);
            reader.onload = function(f) {
                var data = f.target.result;
                fabric.Image.fromURL(data, function(img) {
                    var Img2 = img.set().scale(0.5);
                    canvasSec.add(Img2).renderAll();
                    canvasSec.setActiveObject(Img2);
                });
            };
            reader.readAsDataURL(file);
        });
        $('.delete_object').click(function() {
            var activeObj = canvasSec.getActiveObjects();
            if (confirm('Are you sure to delete?')) {
                canvasSec.discardActiveObject();
                canvasSec.remove(...activeObj);
            }
        });
        // Text
        $('#fill').change(function() {
            var obj = canvasSec.getActiveObject();

            if (obj) {
                // old api
                // obj.setFill($(this).val());
                obj.set("fill", this.value);
            }
            canvasSec.renderAll();
        });

        $('#font').change(function() {
            var obj = canvasSec.getActiveObject();

            if (obj) {
                // old api
                // obj.setFontFamily($(this).val());
                obj.set("fontFamily", this.value);
            }

            canvasSec.renderAll();
        });

        $(document).ready(function() {
            addText = function() {
                var oText = new fabric.IText('Tap and Type', {
                    left: 100,
                    top: 100,
                });

                canvasSec.add(oText);
                oText.bringToFront();
                canvasSec.setActiveObject(oText);
                $('#fill, #font').trigger('change');
            }
        })
        $('.delete_object').click(function() {
            var activeObj = canvasSec.getActiveObjects();
            if (confirm('Are you sure to delete?')) {
                canvasSec.discardActiveObject();
                canvasSec.remove(...activeObj);
            }
        });

        var material = new BABYLON.PBRMaterial("pbr", scene);

        //var texture = new BABYLON.Texture("textures/shirt_diffuse.png", scene, true, false);



        // texture.wAng = Math.PI;
        // texture.uScale = -1;

        var nrmtexture = new BABYLON.Texture("textures/shirt_normal.png", scene, true, false);
        var spectexture = new BABYLON.Texture("textures/shirt_spec.png", scene, true, false);


        BABYLON.SceneLoader.ImportMesh("", "gltf/", "shirt.gltf", scene, function(mesh) {
            scene.createDefaultCameraOrLight(true, true, true);
            var meshOne = mesh[0];


            var myGoodMat = scene.getMaterialByName("material");

            var texture = new BABYLON.DynamicTexture("texture", canvasSecond, scene, 2, 2, true, false);
            myGoodMat.albedoTexture = texture;



            console.log("myGoodMat.albedoTexture.name = " + myGoodMat.albedoTexture.name);



            myGoodMat.reflectionTexture = new BABYLON.HDRCubeTexture("textures/abandoned_factory_canteen_02_2k.hdr", scene, 218, false, false, false, false);
            myGoodMat.bumpTexture = nrmtexture;
            myGoodMat.specularTexture = spectexture;

            myGoodMat.metallic = 0;
            myGoodMat.roughness = 1;


            meshOne.material = myGoodMat;
            scene.onBeforeRenderObservable.add(() => {

                texture.update(false);

            });

        });
        var imageSaver = document.getElementById('lnkDownload');
        imageSaver.addEventListener('click', saveImage, false);

        function saveImage(e) {
            this.href = canvasSec.toDataURL({
                format: 'png',
                quality: 0.8
            });
            this.download = 'canvas.png'
        }



        return scene;
    }
    var scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    })
});